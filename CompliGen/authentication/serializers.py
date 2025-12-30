# in the serializer we will have the username password email company_name industry_type and the role
# these fields must be validated and the user must be signed up

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, Customer
from django.core import signing
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta


class CustomerSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    company_name = serializers.CharField(max_length=255)
    industry_type = serializers.CharField(max_length=255)
    role = serializers.CharField(max_length=255)

    def validate(self, data):
        username = (data.get("username") or "").strip()
        raw_email = data.get("email", "")
        email = User.objects.normalize_email(raw_email)

        # store normalized values back into validated data
        data["username"] = username
        data["email"] = email

        if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {"message": "A user account already exists with the provided credentials."}
            )

        return data

    

    def create(self, validated_data):
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        company_name = validated_data.pop("company_name")
        industry_type = validated_data.pop("industry_type")
        role = validated_data.pop("role")

        # get the company that has the same compamy name and industry type
        company = Company.objects.filter(name=company_name, industry=industry_type).first()

        # create the company if it does not exist
        if not company:
            company = Company.objects.create(name=company_name, industry=industry_type)

        # create the user
        user = User.objects.create_user(username=username, email=email, password=password)

        # create the customer
        customer = Customer.objects.create(user=user, role=role, company=company)

        return customer

# serializer to use the email instead of username
class EmailVerificationSerializer(TokenObtainPairSerializer):
    # use the username instead of email
    username_field = 'email'

    def validate(self, attrs):
        raw_email = attrs.get('email', "")
        email = User.objects.normalize_email(raw_email)
        password = attrs.get('password')

        # check if the user with the email exists
        user = User.objects.filter(email__iexact=email).first()

        if user:
            username = user.username
        else:
            raise serializers.ValidationError({"message":"User not found"})
        
        # verify that the user credentials were correct
        authenticated_user = authenticate(username=username, password=password)

        if not authenticated_user:
            raise serializers.ValidationError({"message":"User not found"})
        
        customer = Customer.objects.filter(user=authenticated_user).first()

        now = timezone.now()

        if not customer:
            raise serializers.ValidationError(
                {"message": "Customer not found"}
            )

        if (now - authenticated_user.date_joined) > timedelta(hours=24)  and not customer.verified:
            raise serializers.ValidationError(
                {"message": "Email not verified. Please verify your email to continue."}
            )
        
        # get the refresh token for the authenticated user
        refresh = RefreshToken.for_user(authenticated_user)

        data = {
            "refresh":str(refresh),
            "access":str(refresh.access_token),
            "email":email
        }

        return data
    
