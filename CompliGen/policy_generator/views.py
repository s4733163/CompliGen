from django.shortcuts import render
from .models import *
from .serializers import *
from .rag.acceptable_use_policy import *
from .rag.cookie_policy import *
from .rag.data_processing_agreement import *
from .rag.privacy_policy import *
from .rag.terms_of_service import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class PrivacyPolicy(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # get the customer and the data
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            # generate the policy
            generated_policy = generate_privacy_policy(**data)

            # save in the db
            serializer = PrivacyPolicyCreateSerializer(data=generated_policy, context={"customer": customer})
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            # provide the id
            generated_policy["id"] = saved_obj.id

            return Response(generated_policy, status=200)

        except Exception as e:
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = PrivacyPolicy.objects.filter(customer_linked=customer)
            serializer =  PrivacyPolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


class TermsOfService(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # get the customer and the data
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_terms_of_service(**data)

            serializer = TermsOfServiceSerializer(data=generated_policy, context={"customer": customer})
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            # provide the id
            generated_policy["id"] = saved_obj.id

            return Response(generated_policy, status=200)
        except Exception as e:
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = TermsOfService.objects.filter(customer_linked=customer)
            serializer =  TermsOfServiceConversionSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


class DataProcessisingAgreement(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # get the customer and the data
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_data_processing_agreement(**data)

            serializer = DataProcessingAgreementCreateSerializer(data=generated_policy, context={"customer": customer})
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            # provide the id
            generated_policy["id"] = saved_obj.id

            return Response(generated_policy, status=200)

        except Exception as e:
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
    
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = DataProcessingAgreement.objects.filter(customer_linked=customer)
            serializer =  DataProcessingAgreementReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)

class AcceptableUsePolicy(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # get the customer and the data
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_acceptable_use_policy(**data)

            serializer = AcceptableUsePolicyCreateSerializer(data=generated_policy, context={"customer": customer})
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            # provide the id
            generated_policy["id"] = saved_obj.id

            return Response(generated_policy, status=200)
        except Exception as e:
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
    
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = AcceptableUsePolicy.objects.filter(customer_linked=customer)
            serializer =  AcceptableUsePolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)

class CookiePolicy(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # get the customer and the data
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_cookie_policy(**data)

            serializer = CookiePolicyCreateSerializer(data=generated_policy, context={"customer": customer})
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            # provide the id
            generated_policy["id"] = saved_obj.id

            return Response(generated_policy, status=200)
        except Exception as e:
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = CookiePolicy.objects.filter(customer_linked=customer)
            serializer =  CookiePolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


