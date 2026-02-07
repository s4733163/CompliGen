"""
Authentication Views Module

This module handles all user authentication operations for the CompliGen platform including:
- User registration with email verification
- JWT-based login with email authentication
- Email verification with time-limited tokens (24-hour expiry)
- Password reset flow with secure tokenized links
- User profile retrieval

Security Features:
- Cryptographically signed verification tokens using Django's signing module
- URL-safe base64 encoded user IDs for password reset links
- Django's built-in token generator for secure password reset tokens
- JWT authentication for protected endpoints
"""

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


# =============================================================================
# EMAIL VERIFICATION HELPERS
# =============================================================================

def create_email_verification_token(user):
    """
    Generate a cryptographically signed token for email verification.

    Uses Django's signing module to create a tamper-proof token containing
    the user's ID. The token is salted with 'email-verification' to prevent
    token reuse across different verification contexts.

    Args:
        user: Django User object for whom to create the verification token

    Returns:
        str: Signed token string that can be safely included in URLs
    """
    token = signing.dumps(
        {"user_id": user.id},
        salt="email-verification"
    )
    return token


def send_email_user(user):
    """
    Send email verification link to the user.

    Generates a verification token and sends an email containing a clickable
    verification link. The link points to the frontend verification page
    with the token as a query parameter.

    Note: Consider moving to Celery task queue in production to avoid
    blocking the response while sending email.

    Args:
        user: Django User object to send verification email to
    """
    token = create_email_verification_token(user)
    link = f"http://localhost:5173/verify_email?token={token}"
    subject = "Verify the email"
    message = f"Hi {user.username},\n\n Thanks for creating an account with compligen . Please click on the link below to verify your identity.\n{link}\n\n. If you did not create an account, please ignore."

    send_mail(
        subject=subject,
        message=message,
        from_email="24varun09@gmail.com",
        recipient_list=[user.email],
        fail_silently=False,
    )


# =============================================================================
# USER REGISTRATION & LOGIN VIEWS
# =============================================================================

class UserRegisterView(APIView):
    """
    Handle new user registration with automatic email verification.

    Creates a new User, Company, and Customer record, then sends a verification
    email with a 24-hour expiry token. Users must verify their email before
    they can log in.

    POST /api/register
    Request Body:
        - email: User's email address (used as username)
        - password: Account password
        - company_name: Name of the user's company
        - industry: Business sector/industry
        - role: User's role in the company
    """

    def post(self, request):
        """Process registration request and send verification email."""
        serialized = CustomerSerializer(data=request.data)

        if serialized.is_valid():
            # Create User, Company, and Customer records via serializer
            customer = serialized.save()

            # Send verification email (consider async queue for production)
            send_email_user(customer.user)

            return Response(
                {"message": "Account created! Check your email and verify within 24 hours."},
                status=status.HTTP_201_CREATED
            )

        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT login view that authenticates using email instead of username.

    Extends SimpleJWT's TokenObtainPairView to use email as the primary
    identifier. Also validates that the user's email is verified before
    allowing login.

    POST /api/login
    Request Body:
        - email: User's email address
        - password: Account password
    Returns:
        - access: JWT access token
        - refresh: JWT refresh token
    """
    serializer_class = EmailVerificationSerializer


# =============================================================================
# EMAIL VERIFICATION VIEWS
# =============================================================================

class UserVerificationView(APIView):
    """
    Verify user email using the token from verification link.

    Validates the signed token from the verification email, checks expiry
    (24-hour limit), and marks the customer account as verified.

    POST /api/user/verify
    Request Body:
        - token: Signed verification token from email link

    Token Validation:
        - SignatureExpired: Token older than 24 hours
        - BadSignature: Token has been tampered with
    """

    def post(self, request):
        """Validate token and mark user as verified."""
        token = request.data.get("token")
        if not token:
            return Response({"message": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate token signature and check 24-hour expiry
        try:
            payload = signing.loads(
                token,
                salt="email-verification",
                max_age=60 * 60 * 24  # 24 hours in seconds
            )
        except signing.SignatureExpired:
            return Response({"status": "expired"}, status=status.HTTP_400_BAD_REQUEST)
        except signing.BadSignature:
            return Response({"status": "invalid"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract user ID from verified token payload
        user_id = payload.get("user_id")
        user = User.objects.filter(id=user_id).first()

        if not user:
            return Response({"message": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        customer = Customer.objects.filter(user=user).first()
        if not customer:
            return Response({"message": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicate verification
        if customer.verified:
            return Response({"message": "User already verified"}, status=status.HTTP_200_OK)

        # Mark customer as verified
        customer.verified = True
        customer.save(update_fields=["verified"])

        return Response(
            {"message": "The user has been verified successfully"},
            status=status.HTTP_200_OK
        )


class ResendEmailVerification(APIView):
    """
    Resend verification email for users with expired or lost verification links.

    Allows unverified users to request a new verification email. Validates
    that the user exists and hasn't already verified their email.

    POST /api/failed/verify
    Request Body:
        - email: User's registered email address
    """

    def post(self, request):
        """Generate and send a new verification email."""
        raw_email = request.data.get("email", "")
        email = User.objects.normalize_email(raw_email)

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        customer = Customer.objects.filter(user=user).first()

        if not customer:
            return Response({"message": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent resending if already verified
        if customer.verified:
            return Response({"message": "User already verified"}, status=status.HTTP_400_BAD_REQUEST)

        send_email_user(user)

        return Response({"message": "Email sent successfully."}, status=status.HTTP_201_CREATED)


# =============================================================================
# PASSWORD RESET VIEWS
# =============================================================================

def password_reset(user):
    """
    Generate password reset token and send reset email.

    Creates a secure, one-time-use password reset link using Django's
    built-in token generator. The token is tied to the user's current
    password hash, so it becomes invalid after password change.

    Security:
        - URL-safe base64 encoded user ID (prevents enumeration)
        - Token invalidated after password change
        - Token has built-in expiry (configured in settings)

    Args:
        user: Django User object requesting password reset

    Returns:
        tuple: (uid, token) - URL-safe encoded user ID and reset token
    """
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

    subject = "Reset your password"
    message = f"Hi {user.username},\n\nClick the link below to reset your password:\n{reset_link}\n\nIf you didn't request this, please ignore this email."

    # Consider async queue for production to avoid blocking response
    send_mail(
        subject=subject,
        message=message,
        from_email="24varun09@gmail.com",
        recipient_list=[user.email],
        fail_silently=False,
    )

    return uid, token


class UserResetAPIView(APIView):
    """
    Initiate password reset flow by sending reset email.

    Validates that the email exists and sends a password reset link.
    Does not reveal whether the email exists in the system for security
    (though current implementation does - consider updating for production).

    POST /api/user/reset/
    Request Body:
        - email: User's registered email address
    """

    def post(self, request):
        """Send password reset email if user exists."""
        raw_email = request.data.get("email")
        email = User.objects.normalize_email(raw_email)

        if not raw_email:
            return Response({"message": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()

        # Verify user exists and has a password set
        if user and user.password.strip():
            uid, token = password_reset(user)
            return Response(
                {"message": "The email has been sent", "uid": uid, "token": token},
                status=status.HTTP_200_OK
            )

        return Response({"message": "The user does not exist"}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetAPIView(APIView):
    """
    Complete password reset by validating token and setting new password.

    Validates the UID and token from the reset link, then updates the
    user's password. The token is automatically invalidated after use
    since it's tied to the user's password hash.

    POST /api/user/password/new/
    Request Body:
        - uid: URL-safe base64 encoded user ID
        - token: Password reset token from email
        - new_password: New password to set
    """

    def post(self, request):
        """Validate reset token and update user password."""
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response({"message": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

        # Decode UID and retrieve user
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"message": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate token (checks expiry and password hash match)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# USER PROFILE VIEW
# =============================================================================

class UserProfile(APIView):
    """
    Retrieve authenticated user's profile information.

    Protected endpoint requiring valid JWT authentication.
    Returns basic user information for display in the frontend.

    GET /api/credentials
    Headers:
        - Authorization: Bearer <access_token>
    Returns:
        - username: User's display name
        - email: User's email address
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return current user's profile data."""
        username = request.user.username
        email = request.user.email
        return Response({"username": username, "email": email}, status=status.HTTP_200_OK)

