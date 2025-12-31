from django.contrib.auth.models import User
from .models import Company, Customer
from django.core import signing
from .serializers import CustomerSerializer, EmailVerificationSerializer
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode

# remaining tomorrow
# set up the create, validate, smtp, forgot password, reset password, email verification, l;ogin and connect to frontedn

# Create your views here.
# returns the token for verification
def create_email_verification_token(user):
    token = signing.dumps(
        {"user_id": user.id},
        salt="email-verification"
    )
    return token

# sends the email with the token attached
def send_email_user(user):
    token = create_email_verification_token(user)
    link = f"http://localhost:5173/verify_email?token={token}"
    subject = "Verify the email"
    message = f"Hi {user.username},\n\n Thanks for creating an account with compligen . Please click on the link below to verify your identity.\n{link}\n\n. If you did not create an account, please ignore."


    # sending the mail to the user for resetting the password
    send_mail(
        subject=subject,
        message=message,
        from_email="24varun09@gmail.com",
        recipient_list=[user.email],
        fail_silently=False,
    )


# user registration with the email verification link
class UserRegisterView(APIView):
    def post(self, request):
        # convert from json to object
        serialized = CustomerSerializer(data=request.data)

        # check if serializer is valid, valid method called
        if serialized.is_valid():

            # returns the customer object that was created, create method called
            customer = serialized.save() 

            # get the token for verification that was attached in the link and sent via email
            # this can be put in a queue with the celery to not delay the response
            send_email_user(customer.user)

            return Response({"message": "Account created! Check your email and verify within 24 hours."}, status=status.HTTP_201_CREATED)
        
        # add the serializers with errors
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
    
# login using email instead of username
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailVerificationSerializer


# user_verification serializer
class UserVerificationView(APIView):
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"message": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # check if the token is not expired and does not has bad signature
        try:
            payload = signing.loads(
                token,
                salt="email-verification",
                max_age=60 * 60 * 24
            )
        except signing.SignatureExpired:
            return Response({"status": "expired"}, status=status.HTTP_400_BAD_REQUEST)
        except signing.BadSignature:
            return Response({"status": "invalid"}, status=status.HTTP_400_BAD_REQUEST)
        
        # unwrapping the payload
        user_id = payload.get("user_id")
        user = User.objects.filter(id=user_id).first()

        # check for the user
        if not user:
            return Response({"message": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        # check for the customer
        customer = Customer.objects.filter(user=user).first()
        if not customer:
            return Response({"message": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)

        # check if the customer is already verified
        if customer.verified:
            return Response({"message": "User already verified"}, status=status.HTTP_200_OK)
        
        # ensure that the customer is verifed and save the updates
        customer.verified = True
        customer.save(update_fields=["verified"])

        return Response(
            {"message": "The user has been verified successfully"},
            status=status.HTTP_200_OK
        )

        
# resend email verification
class ResendEmailVerification(APIView):

    def post(self, request):
        raw_email = request.data.get("email", "")
        email = User.objects.normalize_email(raw_email)

    
        user = User.objects.filter(email__iexact=email).first()

        # check if the user exists
        if not user:
            return Response({"message":"User not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        # get the customer corresponding to the user and check for existence
        customer = Customer.objects.filter(user=user).first()

        if not customer:
            return Response({"message":"Customer not found"}, status=status.HTTP_400_BAD_REQUEST)

        # show error if customer already verified
        if customer.verified:
            return Response({"message":"User already verified"}, status=status.HTTP_400_BAD_REQUEST)
        
        # send the email with the link that has the token
        send_email_user(user)

        return Response({"message": "Email sent successfully."}, status=status.HTTP_201_CREATED)


# sends an email with the password reset email
def password_reset(user):
    # generate the uid and the token that is added in the url
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # the link that the user will access
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

    subject = "Reset your password"

    # the message has the link embedded in it
    message = f"Hi {user.username},\n\nClick the link below to reset your password:\n{reset_link}\n\nIf you didn't request this, please ignore this email."

    # sending the mail to the user for resetting the password
    # this can also be put in a queue to not delay the response
    send_mail(
        subject=subject,
        message=message,
        from_email="24varun09@gmail.com",
        recipient_list=[user.email],
        fail_silently=False,
    )

    # uid and token are sent to the frontend and embedded in the url
    return uid, token
        

# sends the email to reset the password
class UserResetAPIView(APIView):
    def post(self, request):
        raw_email = request.data.get("email")  # safer alternative to []
        email = User.objects.normalize_email(raw_email)

        # will be validated on the frontend 
        if not raw_email:
            return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # this returns a query set so use .first() to get the actual object
        user = User.objects.filter(email__iexact=email).first() # check if the email exists

        # check if the user and the password exists
        if user and user.password.strip():
            uid, token = password_reset(user)
            return Response({"message":"The email has been sent", "uid": uid, "token":token}, status=status.HTTP_200_OK)
        
        
        return Response({"message":"The user does not exist"}, status=status.HTTP_404_NOT_FOUND)

# changes the password based on the email that has been sent
class PasswordResetAPIView(APIView):
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        # check if anything is missing
        if not uidb64 or not token or not new_password:
            return Response({"message": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)
        
        # check if the uid and user is valid
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"message": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)
        
        # check if the token exists
        if default_token_generator.check_token(user, token):
            # the user is able to set the password
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
        


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    # returns the user credentials
    def get(self, request):
        username = request.user.username
        email = request.user.email
        return Response({"username":username, "email":email}, status=status.HTTP_200_OK)

