"""
Policy Generator Views Module

This module provides REST API endpoints for generating, retrieving, and managing
AI-powered compliance documents. Each policy type has dedicated views for:
- POST: Generate new policy using RAG (Retrieval-Augmented Generation)
- GET: Retrieve all policies for the authenticated user
- DELETE: Remove a specific policy

Supported Policy Types:
1. Privacy Policy - Australian Privacy Act 1988 compliant
2. Terms of Service - Australian Consumer Law (ACL) compliant
3. Data Processing Agreement - GDPR-style data processing terms
4. Acceptable Use Policy - Service usage rules and enforcement
5. Cookie Policy - Cookie usage and consent information

All endpoints require JWT authentication and return policies linked to the
authenticated user's customer account.

RAG Pipeline:
    User Input → Vector Search (ChromaDB) → Context Augmentation →
    Gemini Generation → Pydantic Validation → Database Storage
"""

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


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def log_exception(logger, request, exc, context):
    """
    Log detailed exception information for debugging and monitoring.

    Captures request context including path, method, and payload to help
    diagnose issues in policy generation. Uses structured logging format
    compatible with log aggregation services.

    Args:
        logger: Python logger instance
        request: DRF request object
        exc: Exception that was raised
        context: String describing the error context (e.g., "PrivacyPolicy IntegrityError")
    """
    logger.error(
        f"{context} failed for user_id={request.user.id}",
        exc_info=True,
        extra={
            "path": request.path,
            "method": request.method,
            "payload": request.data,
        },
    )


# =============================================================================
# PRIVACY POLICY VIEWS
# =============================================================================

class PrivacyPolicyView(APIView):
    """
    Generate and retrieve Privacy Policies compliant with Australian Privacy Act 1988.

    POST: Generate a new privacy policy using RAG pipeline
        - Retrieves relevant legal context (Privacy Act, APPs)
        - Retrieves industry-specific examples from vector store
        - Generates structured policy via Gemini with Pydantic validation
        - Stores policy with nested sections in PostgreSQL

    GET: Retrieve all privacy policies for the authenticated user
        - Returns policies ordered by creation date (newest first)
        - Includes all nested sections and subsections

    Endpoints:
        POST /documents/generate/api/privacypolicy
        GET /documents/generate/api/privacypolicy
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Generate a new privacy policy using the RAG pipeline."""
        try:
            user = request.user
            data = request.data
            customer = Customer.objects.filter(user=user).first()

            # Generate policy using RAG (retrieval + Gemini generation)
            generated_policy = generate_privacy_policy(**data)

            # Validate and save to database with nested sections
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
        """Retrieve all privacy policies for the authenticated user."""
        try:
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            policies = PrivacyPolicy.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer = PrivacyPolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


# =============================================================================
# TERMS OF SERVICE VIEWS
# =============================================================================

class TermsOfServiceView(APIView):
    """
    Generate and retrieve Terms of Service compliant with Australian Consumer Law.

    POST: Generate a new ToS document using RAG pipeline
        - Ensures ACL compliance statements are included
        - Covers service description, pricing, IP rights, liability
        - Generates 2000-3000 word comprehensive document

    GET: Retrieve all ToS documents for the authenticated user

    Endpoints:
        POST /documents/generate/api/tos
        GET /documents/generate/api/tos
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Generate a new Terms of Service using the RAG pipeline."""
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
        """Retrieve all Terms of Service for the authenticated user."""
        try:
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            policies = TermsOfService.objects.filter(customer_linked=customer).order_by('-created_at')
            serializer = TermsOfServiceConversionSerializer(policies, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


# =============================================================================
# DATA PROCESSING AGREEMENT VIEWS
# =============================================================================

class DataProcessisingAgreementView(APIView):
    """
    Generate and retrieve Data Processing Agreements (DPAs).

    POST: Generate a new DPA with GDPR-style data processing terms
        - Defines controller/processor responsibilities
        - Includes security measures and sub-processor management
        - Generates annexes for processing details

    GET: Retrieve all DPAs for the authenticated user

    Endpoints:
        POST /documents/generate/api/dpa
        GET /documents/generate/api/dpa
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Generate a new Data Processing Agreement using the RAG pipeline."""
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
        """Retrieve all Data Processing Agreements for the authenticated user."""
        try:
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            policies = DataProcessingAgreement.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer = DataProcessingAgreementReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


# =============================================================================
# ACCEPTABLE USE POLICY VIEWS
# =============================================================================

class AcceptableUsePolicyView(APIView):
    """
    Generate and retrieve Acceptable Use Policies (AUPs).

    POST: Generate a new AUP defining service usage rules
        - Covers permitted and prohibited activities
        - Includes monitoring, enforcement, and violation consequences
        - Provides reporting mechanisms for abuse

    GET: Retrieve all AUPs for the authenticated user

    Endpoints:
        POST /documents/generate/api/aup
        GET /documents/generate/api/aup
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Generate a new Acceptable Use Policy using the RAG pipeline."""
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
        """Retrieve all Acceptable Use Policies for the authenticated user."""
        try:
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            policies = AcceptableUsePolicy.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer = AcceptableUsePolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


# =============================================================================
# COOKIE POLICY VIEWS
# =============================================================================

class CookiePolicyView(APIView):
    """
    Generate and retrieve Cookie Policies compliant with Privacy Act 1988.

    POST: Generate a new cookie policy (800-1500 words)
        - Documents types of cookies used (essential, analytics, marketing)
        - Explains purpose and duration of each cookie type
        - Lists third-party services and their cookies
        - Provides browser-specific opt-out instructions

    GET: Retrieve all cookie policies for the authenticated user

    Endpoints:
        POST /documents/generate/api/cookie
        GET /documents/generate/api/cookie
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Generate a new Cookie Policy using the RAG pipeline."""
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
        """Retrieve all Cookie Policies for the authenticated user."""
        try:
            user = request.user
            customer = Customer.objects.filter(user=user).first()

            policies = CookiePolicy.objects.filter(customer_linked=customer).order_by("-created_at")
            serializer = CookiePolicyReadSerializer(policies, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": "Failed to get the policies"}, status=500)


# =============================================================================
# DELETE VIEWS
# These views handle policy deletion with ownership verification.
# Each ensures the policy belongs to the authenticated user before deletion.
# =============================================================================

class PrivacyPolicyDeleteView(APIView):
    """
    Delete a specific Privacy Policy.

    Verifies ownership before deletion - only the policy owner can delete.
    Related sections are automatically deleted via CASCADE.

    DELETE /documents/generate/api/privacypolicy/<id>
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        """Delete privacy policy if owned by authenticated user."""
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = PrivacyPolicy.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TermsOfServiceDeleteView(APIView):
    """
    Delete a specific Terms of Service document.

    DELETE /documents/generate/api/tos/<id>
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        """Delete ToS if owned by authenticated user."""
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = TermsOfService.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DataProcessingAgreementDeleteView(APIView):
    """
    Delete a specific Data Processing Agreement.

    DELETE /documents/generate/api/dpa/<id>
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        """Delete DPA if owned by authenticated user."""
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = DataProcessingAgreement.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AcceptableUsePolicyDeleteView(APIView):
    """
    Delete a specific Acceptable Use Policy.

    DELETE /documents/generate/api/aup/<id>
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        """Delete AUP if owned by authenticated user."""
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = AcceptableUsePolicy.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CookiePolicyDeleteView(APIView):
    """
    Delete a specific Cookie Policy.

    DELETE /documents/generate/api/cookie/<id>
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        """Delete cookie policy if owned by authenticated user."""
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        obj = CookiePolicy.objects.filter(id=id, customer_linked=customer).first()
        if not obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# =============================================================================
# DASHBOARD VIEW
# =============================================================================

class DashboardView(APIView):
    """
    Provide dashboard analytics for the authenticated user.

    Returns aggregated statistics about the user's generated policies,
    including total counts per policy type and the most recently
    generated policy of each type for quick access.

    GET /documents/generate/api/dashboard

    Response Structure:
        {
            "total_policies": int,
            "counts": {
                "privacy_policy": int,
                "terms_of_service": int,
                "data_processing_agreement": int,
                "acceptable_use_policy": int,
                "cookie_policy": int
            },
            "latest": {
                "privacy_policy": {...} | null,
                "terms_of_service": {...} | null,
                ...
            }
        }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return policy statistics and latest policies for dashboard display."""
        user = request.user
        customer = Customer.objects.filter(user=user).first()

        if not customer:
            return Response({"error": "Customer not found"}, status=404)

        # Aggregate policy counts for each type
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

        # Fetch most recent policy of each type for quick access
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
