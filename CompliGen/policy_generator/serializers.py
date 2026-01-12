from rest_framework import serializers
from .models import *

#---------------------------------------------------------------------------------------------------------
# TERMS OF SERVICE
#---------------------------------------------------------------------------------------------------------

class TermsOfServiceSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToSSection
        fields = ["section_number", "heading", "content"]

class TermsOfServiceSerializer(serializers.ModelSerializer):
    sections = TermsOfServiceSectionSerializer(many=True)

    class Meta:
        model = TermsOfService
        fields = [
            "company_name",
            "last_updated",
            "website_url",
            "contact_email",
            "phone_number",

            "service_description",
            "service_type",
            "pricing_model",
            "free_trial_terms",
            "payment_terms",

            "refund_policy",
            "cancellation_terms",

            "eligibility_requirements",
            "prohibited_activities",

            "user_content_license",
            "user_content_responsibilities",

            "intellectual_property_ownership",
            "confidentiality_obligations",

            "consumer_guarantees",
            "acl_statement",

            "liability_limitations",
            "disclaimers",

            "termination_rights",
            "dispute_resolution_process",

            "governing_law",

            "support_terms",
            "availability_terms",
            "international_terms",
            "sections"
        ]

    # we are creating objects based on json
    def create(self, validated_data):
        customer = self.context.get("customer")

        if not customer:
            raise serializers.ValidationError({"customer": "Customer must be provided in serializer context."})


        # we get the sections
        sections = validated_data.pop("sections", [])

        # create the terms of Service
        ToS = TermsOfService.objects.create(customer_linked=customer, **validated_data)

        for section in sections:
            ToSSection.objects.create(terms=ToS, **section)

        return ToS
    
class TermsOfServiceConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsOfService
        fields = "__all__"

    def to_representation(self, instance):
        # get the original json that does not has sections
        data = super().to_representation(instance)

        # get the sections
        tos_sections = ToSSection.objects.filter(terms=instance).order_by("section_number")

        data["sections"] = TermsOfServiceSectionSerializer(tos_sections, many=True).data

        return data

#---------------------------------------------------------------------------------------------------------
# ACCEPTABLE USE POLICY
#---------------------------------------------------------------------------------------------------------
   
class AUPSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AUPSection
        fields = ["section_number", "heading", "content"]


class AcceptableUsePolicyCreateSerializer(serializers.ModelSerializer):
    sections = AUPSectionSerializer(many=True)

    class Meta:
        model = AcceptableUsePolicy
        fields = [
            "company_name",
            "last_updated",
            "website_url",
            "contact_email",
            "phone_number",
            "permitted_usage_types",
            "prohibited_activities",
            "industry_specific_restrictions",
            "user_monitoring_practices",
            "reporting_illegal_activities",
            "sections",
        ]

    def create(self, validated_data):
        customer = self.context.get("customer")
        if not customer:
            raise serializers.ValidationError(
                {"customer": "Customer must be provided in serializer context."}
            )

        sections = validated_data.pop("sections", [])

        policy = AcceptableUsePolicy.objects.create(
            customer_linked=customer,
            **validated_data
        )

        for section in sections:
            AUPSection.objects.create(policy=policy, **section)

        return policy
    
class AcceptableUsePolicyReadSerializer(serializers.ModelSerializer):
    sections = AUPSectionSerializer(many=True, read_only=True)

    class Meta:
        model = AcceptableUsePolicy
        fields = [
            "id",
            "company_name",
            "last_updated",
            "website_url",
            "contact_email",
            "phone_number",
            "permitted_usage_types",
            "prohibited_activities",
            "industry_specific_restrictions",
            "user_monitoring_practices",
            "reporting_illegal_activities",
            "sections",
        ]


#---------------------------------------------------------------------------------------------------------
# DATA PROCESSISING AGREEMENT
#---------------------------------------------------------------------------------------------------------

class DPASubProcessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DPASubProcessor
        fields = ["category_name", "provider_names"]


class DPADefinitionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DPADefinitions
        fields = ["terms"]


class DPAAnnexASerializer(serializers.ModelSerializer):
    sub_processors = DPASubProcessorSerializer(many=True)

    class Meta:
        model = DPAAnnexA
        fields = [
            "subject_matter_of_processing",
            "duration_of_processing",
            "nature_and_purpose_of_processing",
            "categories_of_data_subjects",
            "types_of_personal_information",
            "data_processing_locations",
            "sub_processors",
        ]


class DPAAnnexBSerializer(serializers.ModelSerializer):
    class Meta:
        model = DPAAnnexB
        fields = [
            "technical_measures",
            "organisational_measures",
            "physical_security_measures",
            "security_certifications",
        ]


class DPASectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DPASection
        fields = ["section_number", "heading", "content"]

class DataProcessingAgreementCreateSerializer(serializers.ModelSerializer):
    definitions = DPADefinitionsSerializer()
    annex_a = DPAAnnexASerializer()
    annex_b = DPAAnnexBSerializer()
    sections = DPASectionSerializer(many=True)

    class Meta:
        model = DataProcessingAgreement
        fields = [
            "company_name",
            "last_updated",
            "website_url",
            "contact_email",
            "phone_number",

            "role_controller_or_processor",
            "breach_notification_timeframe",
            "data_deletion_timelines",
            "audit_rights",
            "data_processing_locations",

            "definitions",
            "annex_a",
            "annex_b",
            "sections",
        ]

    def create(self, validated_data):
        customer = self.context.get("customer")
        if not customer:
            raise serializers.ValidationError(
                {"customer": "Customer must be provided in serializer context."}
            )

        definitions_data = validated_data.pop("definitions", {})
        annex_a_data = validated_data.pop("annex_a", {})
        annex_b_data = validated_data.pop("annex_b", {})
        sections_data = validated_data.pop("sections", [])

        # Create main DPA
        dpa = DataProcessingAgreement.objects.create(
            customer_linked=customer,
            **validated_data
        )

        # Definitions (OneToOne)
        DPADefinitions.objects.create(dpa=dpa, **definitions_data)

        # Annex A (OneToOne) + Sub-processors (FK to Annex A)
        sub_processors_data = annex_a_data.pop("sub_processors", [])
        annex_a = DPAAnnexA.objects.create(dpa=dpa, **annex_a_data)

        for sp in sub_processors_data:
            DPASubProcessor.objects.create(annex_a=annex_a, **sp)

        # Annex B (OneToOne)
        DPAAnnexB.objects.create(dpa=dpa, **annex_b_data)

        # Sections (FK to DPA)
        for sec in sections_data:
            DPASection.objects.create(dpa=dpa, **sec)

        return dpa

class DataProcessingAgreementReadSerializer(serializers.ModelSerializer):
    definitions = DPADefinitionsSerializer(read_only=True)
    annex_a = DPAAnnexASerializer(read_only=True)
    annex_b = DPAAnnexBSerializer(read_only=True)
    sections = DPASectionSerializer(many=True, read_only=True)

    class Meta:
        model = DataProcessingAgreement
        fields = [
            "id",
            "company_name",
            "last_updated",
            "website_url",
            "contact_email",
            "phone_number",

            "role_controller_or_processor",
            "breach_notification_timeframe",
            "data_deletion_timelines",
            "audit_rights",
            "data_processing_locations",

            "definitions",
            "annex_a",
            "annex_b",
            "sections",
        ]

#---------------------------------------------------------------------------------------------------------
# PRIVACY POLICY
#---------------------------------------------------------------------------------------------------------


class PrivacyPolicySubsectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicySubsection
        fields = ["subsection_number", "heading", "content"]


class PrivacyPolicySectionSerializer(serializers.ModelSerializer):
    subsections = PrivacyPolicySubsectionSerializer(many=True, required=False)

    class Meta:
        model = PrivacyPolicySection
        fields = ["section_number", "heading", "content", "subsections"]


class PrivacyPolicyContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicyContactInfo
        fields = ["email", "phone", "website", "postal_address"]

class PrivacyPolicyCreateSerializer(serializers.ModelSerializer):
    contact_info = PrivacyPolicyContactInfoSerializer()
    sections = PrivacyPolicySectionSerializer(many=True)

    class Meta:
        model = PrivacyPolicy
        fields = [
            "company_name",
            "last_updated",
            "introduction",
            "sections",
            "complaints_process",
            "oaic_contact",
            "contact_info",
            "apps_addressed",
        ]

    def create(self, validated_data):
        customer = self.context.get("customer")
        if not customer:
            raise serializers.ValidationError(
                {"customer": "Customer must be provided in serializer context."}
            )

        contact_info_data = validated_data.pop("contact_info")
        sections_data = validated_data.pop("sections", [])

        policy = PrivacyPolicy.objects.create(
            customer_linked=customer,
            **validated_data
        )

        # OneToOne contact info
        PrivacyPolicyContactInfo.objects.create(policy=policy, **contact_info_data)

        # Sections + optional subsections
        for sec in sections_data:
            subsections_data = sec.pop("subsections", None)

            section_obj = PrivacyPolicySection.objects.create(policy=policy, **sec)

            # create the subsections as well if exists
            if subsections_data:
                for sub in subsections_data:
                    PrivacyPolicySubsection.objects.create(section=section_obj, **sub)

        return policy

class PrivacyPolicyReadSerializer(serializers.ModelSerializer):
    contact_info = PrivacyPolicyContactInfoSerializer(read_only=True)
    sections = PrivacyPolicySectionSerializer(many=True, read_only=True)

    class Meta:
        model = PrivacyPolicy
        fields = [
            "id",
            "company_name",
            "last_updated",
            "introduction",
            "sections",
            "complaints_process",
            "oaic_contact",
            "contact_info",
            "apps_addressed",
        ]


#---------------------------------------------------------------------------------------------------------
# COOKIE POLICY
#---------------------------------------------------------------------------------------------------------

class CookiePolicySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CookiePolicySection
        fields = ["section_number", "heading", "content"]


class CookieThirdPartyServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CookieThirdPartyService
        fields = ["service_name", "purpose", "opt_out_link"]


class CookieBrowserInstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CookieBrowserInstruction
        fields = ["browser_name", "instructions", "help_link"]

class CookiePolicyCreateSerializer(serializers.ModelSerializer):
    sections = CookiePolicySectionSerializer(many=True)
    third_party_services = CookieThirdPartyServiceSerializer(many=True)
    browser_instructions = CookieBrowserInstructionSerializer(many=True)

    class Meta:
        model = CookiePolicy
        fields = [
            "company_name",
            "last_updated",
            "introduction",
            "cookie_types",
            "sections",
            "third_party_services",
            "cookie_duration",
            "browser_instructions",
            "contact_email",
            "contact_phone",
            "website",
        ]

    def create(self, validated_data):
        customer = self.context.get("customer")
        if not customer:
            raise serializers.ValidationError(
                {"customer": "Customer must be provided in serializer context."}
            )

        sections_data = validated_data.pop("sections", [])
        tps_data = validated_data.pop("third_party_services", [])
        browser_data = validated_data.pop("browser_instructions", [])

        policy = CookiePolicy.objects.create(
            customer_linked=customer,
            **validated_data
        )

        for sec in sections_data:
            CookiePolicySection.objects.create(policy=policy, **sec)

        for tps in tps_data:
            CookieThirdPartyService.objects.create(policy=policy, **tps)

        for b in browser_data:
            CookieBrowserInstruction.objects.create(policy=policy, **b)

        return policy
    
class CookiePolicyReadSerializer(serializers.ModelSerializer):
    sections = CookiePolicySectionSerializer(many=True, read_only=True)
    third_party_services = CookieThirdPartyServiceSerializer(many=True, read_only=True)
    browser_instructions = CookieBrowserInstructionSerializer(many=True, read_only=True)

    class Meta:
        model = CookiePolicy
        fields = [
            "id",
            "company_name",
            "last_updated",
            "introduction",
            "cookie_types",
            "sections",
            "third_party_services",
            "cookie_duration",
            "browser_instructions",
            "contact_email",
            "contact_phone",
            "website",
        ]
