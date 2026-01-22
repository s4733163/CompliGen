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
from django.db import IntegrityError
import traceback
import logging

logger = logging.getLogger(__name__)

def log_exception(logger, request, exc, context):
    logger.error(
        f"{context} failed for user_id={request.user.id}",
        exc_info=True,
        extra={
            "path": request.path,
            "method": request.method,
            "payload": request.data,
        },
    )


class PrivacyPolicyView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_privacy_policy(**data)

            serializer = PrivacyPolicyCreateSerializer(
                data=generated_policy,
                context={"customer": customer}
            )
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            generated_policy["id"] = saved_obj.id
            return Response(generated_policy, status=200)

        except IntegrityError as e:
            log_exception(logger, request, e, "PrivacyPolicy IntegrityError")
            return Response(
                {"error": "Policy failed to generate. Please retry"},
                status=500
            )

        except serializers.ValidationError as e:
            log_exception(logger, request, e, "PrivacyPolicy ValidationError")
            return Response(
                {"error": "Policy failed to generate. Please retry"},
                status=500
            )

        except Exception as e:
            log_exception(logger, request, e, "PrivacyPolicy UnknownError")
            return Response(
                {"error": "Policy failed to generate. Please retry"},
                status=500
            )
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = PrivacyPolicy.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer =  PrivacyPolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


class TermsOfServiceView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_terms_of_service(**data)

            serializer = TermsOfServiceSerializer(
                data=generated_policy,
                context={"customer": customer}
            )
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            generated_policy["id"] = saved_obj.id
            return Response(generated_policy, status=200)

        except IntegrityError as e:
            log_exception(logger, request, e, "ToS IntegrityError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except serializers.ValidationError as e:
            log_exception(logger, request, e, "ToS ValidationError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except Exception as e:
            log_exception(logger, request, e, "ToS UnknownError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = TermsOfService.objects.filter(customer_linked=customer).order_by('-created_at')
            serializer =  TermsOfServiceConversionSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


class DataProcessisingAgreementView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_data_processing_agreement(**data)

            serializer = DataProcessingAgreementCreateSerializer(
                data=generated_policy,
                context={"customer": customer}
            )
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            generated_policy["id"] = saved_obj.id
            return Response(generated_policy, status=200)

        except IntegrityError as e:
            log_exception(logger, request, e, "DPA IntegrityError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except serializers.ValidationError as e:
            log_exception(logger, request, e, "DPA ValidationError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except Exception as e:
            return log_exception(logger, request, e, "DPA UnknownError")
          
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = DataProcessingAgreement.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer =  DataProcessingAgreementReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)

class AcceptableUsePolicyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_acceptable_use_policy(**data)

            serializer = AcceptableUsePolicyCreateSerializer(
                data=generated_policy,
                context={"customer": customer}
            )
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            generated_policy["id"] = saved_obj.id
            return Response(generated_policy, status=200)

        except IntegrityError as e:
            log_exception(logger, request, e, "AUP IntegrityError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except serializers.ValidationError as e:
            log_exception(logger, request, e, "AUP ValidationError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except Exception as e:
            log_exception(logger, request, e, "AUP UnknownError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = AcceptableUsePolicy.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer =  AcceptableUsePolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)

class CookiePolicyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            generated_policy = generate_cookie_policy(**data)

            serializer = CookiePolicyCreateSerializer(
                data=generated_policy,
                context={"customer": customer}
            )
            serializer.is_valid(raise_exception=True)
            saved_obj = serializer.save()

            generated_policy["id"] = saved_obj.id
            return Response(generated_policy, status=200)

        except IntegrityError as e:
            log_exception(logger, request, e, "CookiePolicy IntegrityError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except serializers.ValidationError as e:
            log_exception(logger, request, e, "CookiePolicy ValidationError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)

        except Exception as e:
            log_exception(logger, request, e, "CookiePolicy UnknownError")
            return Response({"error": "Policy failed to generate. Please retry"}, status=500)
        
    def get(self, request):
        try:
            # get the customer
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            # get all the policies of a customer
            policies = CookiePolicy.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer =  CookiePolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)



class PrivacyPolicyDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = PrivacyPolicy.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TermsOfServiceDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = TermsOfService.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DataProcessingAgreementDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = DataProcessingAgreement.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AcceptableUsePolicyDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = AcceptableUsePolicy.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CookiePolicyDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = CookiePolicy.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        if not customer:
            return Response({"error": "Customer not found"}, status=404)

        # total counts per policy
        privacy_count = PrivacyPolicy.objects.filter(customer_linked=customer).count()
        tos_count = TermsOfService.objects.filter(customer_linked=customer).count()
        dpa_count = DataProcessingAgreement.objects.filter(customer_linked=customer).count()
        aup_count = AcceptableUsePolicy.objects.filter(customer_linked=customer).count()
        cookie_count = CookiePolicy.objects.filter(customer_linked=customer).count()

        total_policies = (
            privacy_count
            + tos_count
            + dpa_count
            + aup_count
            + cookie_count
        )

        # latest policy per type
        latest_privacy = PrivacyPolicy.objects.filter(
            customer_linked=customer
        ).order_by("-created_at").first()

        latest_tos = TermsOfService.objects.filter(
            customer_linked=customer
        ).order_by("-created_at").first()

        latest_dpa = DataProcessingAgreement.objects.filter(
            customer_linked=customer
        ).order_by("-created_at").first()

        latest_aup = AcceptableUsePolicy.objects.filter(
            customer_linked=customer
        ).order_by("-created_at").first()

        latest_cookie = CookiePolicy.objects.filter(
            customer_linked=customer
        ).order_by("-created_at").first()

        response = {
            "total_policies": total_policies,
            "counts": {
                "privacy_policy": privacy_count,
                "terms_of_service": tos_count,
                "data_processing_agreement": dpa_count,
                "acceptable_use_policy": aup_count,
                "cookie_policy": cookie_count,
            },
            "latest": {
                "privacy_policy": (
                    PrivacyPolicyReadSerializer(latest_privacy).data
                    if latest_privacy else None
                ),
                "terms_of_service": (
                    TermsOfServiceConversionSerializer(latest_tos).data
                    if latest_tos else None
                ),
                "data_processing_agreement": (
                    DataProcessingAgreementReadSerializer(latest_dpa).data
                    if latest_dpa else None
                ),
                "acceptable_use_policy": (
                    AcceptableUsePolicyReadSerializer(latest_aup).data
                    if latest_aup else None
                ),
                "cookie_policy": (
                    CookiePolicyReadSerializer(latest_cookie).data
                    if latest_cookie else None
                ),
            }
        }

        return Response(response, status=200)
