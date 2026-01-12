from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
from authentication.models import Customer

ACL_EXACT_STATEMENT = (
    "Nothing in these Terms excludes, restricts or modifies rights under the Australian Consumer Law."
)


#---------------------------------------------------------------------------------------------------------
# TERMS OF SERVICE
#---------------------------------------------------------------------------------------------------------


class TermsOfService(models.Model):
    # Who this document belongs to (your existing Customer model)
    customer_linked = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="tos_documents")

    # Core identity + meta
    company_name = models.CharField(max_length=255)
    last_updated = models.CharField(max_length=255)  # better than CharField
    website_url = models.URLField(max_length=500)
    contact_email = models.EmailField(max_length=254)
    phone_number = models.CharField(max_length=50, blank=True, null=True)

    # Service details
    service_description = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    service_type = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Pricing / payments
    pricing_model = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    free_trial_terms = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    payment_terms = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Refunds and cancellation
    refund_policy = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    cancellation_terms = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Eligibility and restrictions
    eligibility_requirements = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    prohibited_activities = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # User content
    user_content_license = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    user_content_responsibilities = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # IP and confidentiality
    intellectual_property_ownership = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    confidentiality_obligations = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # ACL compliance
    consumer_guarantees = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    acl_statement = models.TextField(default=ACL_EXACT_STATEMENT)

    # Liability and disclaimers
    liability_limitations = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    disclaimers = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Termination
    termination_rights = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Dispute resolution
    dispute_resolution_process = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    governing_law = models.CharField(max_length=255)  # e.g. "New South Wales, Australia"

    # Support and availability
    support_terms = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    availability_terms = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # International operations
    international_terms = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Audit meta (optional but useful for “professional” app)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GinIndex(fields=["service_description"]),
            GinIndex(fields=["service_type"]),
            GinIndex(fields=["prohibited_activities"]),
        ]
    def __str__(self):
        return f"ToS: {self.company_name} ({self.last_updated})"


class ToSSection(models.Model):
    terms = models.ForeignKey(TermsOfService, on_delete=models.CASCADE, related_name="sections")

    section_number = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="1-based section numbering"
    )
    heading = models.CharField(max_length=255)
    content = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True,
        help_text="Array of paragraphs; each item is a paragraph"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["terms", "section_number"],
                name="unique_section_number_per_terms",
            )
        ]
        ordering = ["section_number"]

    def __str__(self):
        return f"{self.section_number}. {self.heading}"


#---------------------------------------------------------------------------------------------------------
# ACCEPTABLE USE POLICY
#---------------------------------------------------------------------------------------------------------

class AcceptableUsePolicy(models.Model):
    customer_linked = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="aup_documents"
    )

    company_name = models.CharField(max_length=255)
    last_updated = models.CharField(max_length=255)

    website_url = models.URLField(max_length=500)
    contact_email = models.EmailField(max_length=254)
    phone_number = models.CharField(max_length=50, blank=True, null=True)

    permitted_usage_types = ArrayField(models.TextField(), default=list, blank=True)
    prohibited_activities = ArrayField(models.TextField(), default=list, blank=True)
    industry_specific_restrictions = ArrayField(models.TextField(), default=list, blank=True)
    user_monitoring_practices = ArrayField(models.TextField(), default=list, blank=True)
    reporting_illegal_activities = ArrayField(models.TextField(), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GinIndex(fields=["permitted_usage_types"]),
            GinIndex(fields=["prohibited_activities"]),
        ]

    def __str__(self):
        return f"AUP: {self.company_name} ({self.last_updated})"


class AUPSection(models.Model):
    policy = models.ForeignKey(
        AcceptableUsePolicy,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    section_number = models.IntegerField(validators=[MinValueValidator(1)])
    heading = models.CharField(max_length=255)
    content = ArrayField(models.TextField(), default=list, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["policy", "section_number"],
                name="unique_section_number_per_aup",
            )
        ]
        ordering = ["section_number"]

    def __str__(self):
        return f"AUP {self.section_number}. {self.heading}"

#---------------------------------------------------------------------------------------------------------
# DATA PROCESSISING AGREEMENT
#---------------------------------------------------------------------------------------------------------

class DataProcessingAgreement(models.Model):
    customer_linked = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="dpa_documents"
    )

    company_name = models.CharField(max_length=255)
    last_updated = models.CharField(max_length=255)

    website_url = models.URLField(max_length=500)
    contact_email = models.EmailField(max_length=254)
    phone_number = models.CharField(max_length=50, blank=True, null=True)

    role_controller_or_processor = ArrayField(models.TextField(), default=list, blank=True)
    breach_notification_timeframe = ArrayField(models.TextField(), default=list, blank=True)
    data_deletion_timelines = ArrayField(models.TextField(), default=list, blank=True)
    audit_rights = ArrayField(models.TextField(), default=list, blank=True)
    data_processing_locations = ArrayField(models.TextField(), default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GinIndex(fields=["data_processing_locations"]),
            GinIndex(fields=["role_controller_or_processor"]),
        ]

    def __str__(self):
        return f"DPA: {self.company_name} ({self.last_updated})"

class DPADefinitions(models.Model):
    dpa = models.OneToOneField(
        DataProcessingAgreement,
        on_delete=models.CASCADE,
        related_name="definitions"
    )
    terms = ArrayField(models.TextField(), default=list, blank=True)

    def __str__(self):
        return f"DPA Definitions for {self.dpa_id}"
    

class DPAAnnexA(models.Model):
    dpa = models.OneToOneField(
        DataProcessingAgreement,
        on_delete=models.CASCADE,
        related_name="annex_a"
    )

    subject_matter_of_processing = ArrayField(models.TextField(), default=list, blank=True)
    duration_of_processing = ArrayField(models.TextField(), default=list, blank=True)
    nature_and_purpose_of_processing = ArrayField(models.TextField(), default=list, blank=True)
    categories_of_data_subjects = ArrayField(models.TextField(), default=list, blank=True)
    types_of_personal_information = ArrayField(models.TextField(), default=list, blank=True)
    data_processing_locations = ArrayField(models.TextField(), default=list, blank=True)

    def __str__(self):
        return f"DPA Annex A for {self.dpa_id}"


class DPASubProcessor(models.Model):
    annex_a = models.ForeignKey(
        DPAAnnexA,
        on_delete=models.CASCADE,
        related_name="sub_processors"
    )
    category_name = models.CharField(max_length=255)
    provider_names = ArrayField(models.TextField(), default=list, blank=True)

    def __str__(self):
        return f"{self.category_name} (Annex A: {self.annex_a_id})"

class DPAAnnexB(models.Model):
    dpa = models.OneToOneField(
        DataProcessingAgreement,
        on_delete=models.CASCADE,
        related_name="annex_b"
    )

    technical_measures = ArrayField(models.TextField(), default=list, blank=True)
    organisational_measures = ArrayField(models.TextField(), default=list, blank=True)
    physical_security_measures = ArrayField(models.TextField(), default=list, blank=True)
    security_certifications = ArrayField(models.TextField(), default=list, blank=True)

    def __str__(self):
        return f"DPA Annex B for {self.dpa_id}"

class DPASection(models.Model):
    dpa = models.ForeignKey(
        DataProcessingAgreement,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    section_number = models.IntegerField(validators=[MinValueValidator(1)])
    heading = models.CharField(max_length=255)
    content = ArrayField(models.TextField(), default=list, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["dpa", "section_number"],
                name="unique_section_number_per_dpa",
            )
        ]
        ordering = ["section_number"]

    def __str__(self):
        return f"DPA {self.section_number}. {self.heading}"

#---------------------------------------------------------------------------------------------------------
# PRIVACY POLICY
#---------------------------------------------------------------------------------------------------------

class PrivacyPolicy(models.Model):
    customer_linked = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="privacy_policies"
    )

    # Header
    company_name = models.CharField(max_length=255)
    last_updated = models.CharField(max_length=255)

    # Introduction
    introduction = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Complaints and OAIC
    complaints_process = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )
    oaic_contact = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Metadata
    apps_addressed = ArrayField(
        base_field=models.IntegerField(
            validators=[MinValueValidator(1), MaxValueValidator(13)]
        ),
        default=list,
        blank=True,
        help_text="List of APP numbers addressed (1–13)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GinIndex(fields=["apps_addressed"]),
        ]

    def __str__(self):
        return f"Privacy Policy: {self.company_name} ({self.last_updated})"

class PrivacyPolicyContactInfo(models.Model):
    policy = models.OneToOneField(
        PrivacyPolicy,
        on_delete=models.CASCADE,
        related_name="contact_info"
    )

    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(max_length=500)
    postal_address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Contact Info for Policy {self.policy_id}"

class PrivacyPolicySection(models.Model):
    policy = models.ForeignKey(
        PrivacyPolicy,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    section_number = models.IntegerField(validators=[MinValueValidator(1)])
    heading = models.CharField(max_length=255)

    # Main section content as paragraphs
    content = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["policy", "section_number"],
                name="unique_privacy_section_number_per_policy",
            )
        ]
        ordering = ["section_number"]

    def __str__(self):
        return f"Section {self.section_number}: {self.heading}"

class PrivacyPolicySubsection(models.Model):
    section = models.ForeignKey(
        PrivacyPolicySection,
        on_delete=models.CASCADE,
        related_name="subsections"
    )

    subsection_number = models.CharField(max_length=20)  # e.g., "1.1"
    heading = models.CharField(max_length=255)

    content = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["section", "subsection_number"],
                name="unique_privacy_subsection_number_per_section",
            )
        ]
        ordering = ["subsection_number"]

    def __str__(self):
        return f"Subsection {self.subsection_number}: {self.heading}"




#---------------------------------------------------------------------------------------------------------
# COOKIE POLICY
#---------------------------------------------------------------------------------------------------------


class CookiePolicy(models.Model):
    customer_linked = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="cookie_policies"
    )

    # Header
    company_name = models.CharField(max_length=255)
    last_updated = models.CharField(max_length=255)

    # Introduction
    introduction = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Cookie information
    cookie_types = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    cookie_duration = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    # Contact
    contact_email = models.EmailField(max_length=254)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GinIndex(fields=["cookie_types"]),
        ]

    def __str__(self):
        return f"Cookie Policy: {self.company_name} ({self.last_updated})"


class CookieThirdPartyService(models.Model):
    policy = models.ForeignKey(
        CookiePolicy,
        on_delete=models.CASCADE,
        related_name="third_party_services"
    )

    service_name = models.CharField(max_length=255)

    purpose = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    opt_out_link = models.URLField(
        max_length=500,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.service_name


class CookieBrowserInstruction(models.Model):
    policy = models.ForeignKey(
        CookiePolicy,
        on_delete=models.CASCADE,
        related_name="browser_instructions"
    )

    browser_name = models.CharField(max_length=100)

    instructions = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    help_link = models.URLField(max_length=500)

    def __str__(self):
        return self.browser_name

class CookiePolicySection(models.Model):
    policy = models.ForeignKey(
        CookiePolicy,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    section_number = models.IntegerField(
        validators=[MinValueValidator(1)]
    )
    heading = models.CharField(max_length=255)

    content = ArrayField(
        base_field=models.TextField(),
        default=list,
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["policy", "section_number"],
                name="unique_cookie_section_number_per_policy",
            )
        ]
        ordering = ["section_number"]

    def __str__(self):
        return f"Section {self.section_number}: {self.heading}"
