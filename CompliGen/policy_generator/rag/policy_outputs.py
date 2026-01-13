# PolicyOutputs.py
# Pydantic schemas for structuring LLM output (JSON) for frontend rendering.


from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


# ============================================================
# Acceptable Use Policy (AUP) - Structured Output
# ============================================================

class AUPSection(BaseModel):
    section_number: int = Field(
        ..., 
        description="1-based section numbering matching the policy structure."
    )
    heading: str = Field(
        ..., 
        description="Section heading exactly as rendered."
    )
    content: List[str] = Field(
        default_factory=list, 
        description="Section content as an array of strings (paragraphs/bullets)."
    )


class StructuredAcceptableUsePolicy(BaseModel):
    company_name: str = Field(
        ...,
        description="Full legal name of the company"
    )
    last_updated: str = Field(
        ..., 
        description="Date in YYYY-MM-DD format (NOT including 'Last Updated:' text)"
    )

    # Optional meta fields (handy for frontend; still strings)
    website_url: str = Field(
        ...,
        description="Company website URL"
    )
    contact_email: str = Field(
        ...,
        description="Contact email for inquiries"
    )
    phone_number: Optional[str] = Field(
        None, 
        description="Contact phone number (optional, null if not provided)"
    )

    # AUP-specific (captured as structured fields)
    permitted_usage_types: List[str] = Field(
        default_factory=list,
        description="MUST populate: Array of permitted use cases for the platform (e.g., ['Commercial business analytics', 'Internal reporting'])"
    )
    prohibited_activities: List[str] = Field(
        default_factory=list,
        description="MUST populate: Array of prohibited activities (e.g., ['Unauthorised access', 'Scraping', 'Resale']). Should have 5-10 items."
    )
    industry_specific_restrictions: List[str] = Field(
        default_factory=list,
        description="MUST populate: Array of industry-specific restrictions (e.g., ['Must not process health records without authority'])"
    )
    user_monitoring_practices: List[str] = Field(
        default_factory=list,
        description="MUST populate: Array describing monitoring practices (e.g., ['Usage logs monitored', 'Access logs tracked'])"
    )
    reporting_illegal_activities: List[str] = Field(
        default_factory=list,
        description="MUST populate: Array describing how illegal activities are reported (e.g., ['Report to law enforcement where required'])"
    )

    # Full policy body in ordered sections
    sections: List[AUPSection] = Field(
        ...,  # ✅ REQUIRED! No default
        min_length=13,  # ✅ Must have at least 13 sections
        description="Array of 13 policy sections with section_number, heading, and content"
    )


# ============================================================
# Data Processing Agreement (DPA) - Structured Output
# ============================================================
# ============================================================
# Data Processing Agreement (DPA) - Structured Output
# ============================================================

class DPADefinitions(BaseModel):
    terms: List[str] = Field(default_factory=list)


class DPASubProcessor(BaseModel):
    category_name: str
    provider_names: List[str] = Field(default_factory=list)


class DPAAnnexA(BaseModel):
    subject_matter_of_processing: List[str] = Field(default_factory=list)
    duration_of_processing: List[str] = Field(default_factory=list)
    nature_and_purpose_of_processing: List[str] = Field(default_factory=list)
    categories_of_data_subjects: List[str] = Field(default_factory=list)
    types_of_personal_information: List[str] = Field(default_factory=list)
    data_processing_locations: List[str] = Field(default_factory=list)
    sub_processors: List[DPASubProcessor] = Field(default_factory=list)


class DPAAnnexB(BaseModel):
    technical_measures: List[str] = Field(default_factory=list)
    organisational_measures: List[str] = Field(default_factory=list)
    physical_security_measures: List[str] = Field(default_factory=list)
    security_certifications: List[str] = Field(default_factory=list)


class DPASection(BaseModel):
    section_number: int
    heading: str
    content: List[str] = Field(default_factory=list)


class StructuredDataProcessingAgreement(BaseModel):
    company_name: str
    last_updated: str = Field(..., description="Date in YYYY-MM-DD format")
    website_url: str
    contact_email: str
    phone_number: Optional[str] = None

    role_controller_or_processor: List[str] = Field(default_factory=list)
    breach_notification_timeframe: List[str] = Field(default_factory=list)
    data_deletion_timelines: List[str] = Field(default_factory=list)
    audit_rights: List[str] = Field(default_factory=list)
    data_processing_locations: List[str] = Field(default_factory=list)

    definitions: DPADefinitions = Field(default_factory=DPADefinitions)
    annex_a: DPAAnnexA = Field(default_factory=DPAAnnexA)
    annex_b: DPAAnnexB = Field(default_factory=DPAAnnexB)

    sections: List[DPASection] = Field(default_factory=list)


class ToSSection(BaseModel):
    section_number: int = Field(
        ...,
        description="1-based section numbering"
    )
    heading: str = Field(
        ...,
        description="Section heading (e.g., 'Acceptance of Terms', 'Consumer Guarantees')"
    )
    content: List[str] = Field(
        default_factory=list,
        description="Section content as array of paragraphs. Each item is a separate paragraph."
    )


class StructuredTermsOfService(BaseModel):
    company_name: str = Field(
        ...,
        description="Full legal name of the company"
    )
    last_updated: str = Field(
        ...,
        description="Date in YYYY-MM-DD format (NOT including 'Last Updated:' text)"
    )
    
    # Contact information
    website_url: str = Field(
        ...,
        description="Company website URL"
    )
    contact_email: str = Field(
        ...,
        description="Contact email for inquiries"
    )
    phone_number: Optional[str] = Field(
        None,
        description="Contact phone number (optional, null if not provided)"
    )
    
    # Service details (arrays for multi-paragraph descriptions)
    service_description: List[str] = Field(
        default_factory=list,
        description="Array describing what the service is and what it provides (e.g., ['Cloud-based analytics platform', 'Provides data visualization tools'])"
    )
    
    service_type: List[str] = Field(
        default_factory=list,
        description="Array of service types offered (e.g., ['SaaS platform', 'Analytics tools'])"
    )
    
    # Subscription and pricing
    pricing_model: List[str] = Field(
        default_factory=list,
        description="Array describing pricing structure (e.g., ['Monthly subscription', 'Annual billing available'])"
    )
    
    free_trial_terms: List[str] = Field(
        default_factory=list,
        description="Array of free trial terms if offered (e.g., ['14-day free trial', 'No credit card required', 'Automatically converts to paid']). Empty if no trial."
    )
    
    payment_terms: List[str] = Field(
        default_factory=list,
        description="Array of payment terms (e.g., ['Billed monthly in advance', 'Accepted payment methods displayed at checkout'])"
    )
    
    # Refunds and cancellation
    refund_policy: List[str] = Field(
        default_factory=list,
        description="Array describing refund policy (e.g., ['Pro-rata refunds available', 'Request within 30 days', 'Subject to ACL rights'])"
    )
    
    cancellation_terms: List[str] = Field(
        default_factory=list,
        description="Array describing how to cancel (e.g., ['Cancel anytime via account settings', 'No cancellation fees', 'Access continues until end of billing period'])"
    )
    
    # Eligibility and restrictions
    eligibility_requirements: List[str] = Field(
        default_factory=list,
        description="Array of eligibility requirements (e.g., ['Must have legal capacity to contract', 'Authorised to bind organisation', 'Must be 18+ if minor restrictions apply'])"
    )
    
    prohibited_activities: List[str] = Field(
        default_factory=list,
        description="Array of prohibited activities (e.g., ['Unauthorised access', 'Scraping', 'Malware distribution', 'Harassment']). 5-10 items typical."
    )
    
    # User content
    user_content_license: List[str] = Field(
        default_factory=list,
        description="Array describing license granted to company for user content (e.g., ['You retain ownership', 'Grant us license to host and display', 'License terminates when content deleted'])"
    )
    
    user_content_responsibilities: List[str] = Field(
        default_factory=list,
        description="Array of user responsibilities for content (e.g., ['Ensure content is lawful', 'Do not infringe IP rights', 'Responsible for all uploaded content'])"
    )
    
    # IP and confidentiality
    intellectual_property_ownership: List[str] = Field(
        default_factory=list,
        description="Array clarifying IP ownership (e.g., ['Platform owned by company', 'User retains ownership of user content', 'Trademarks remain property of respective owners'])"
    )
    
    confidentiality_obligations: List[str] = Field(
        default_factory=list,
        description="Array of confidentiality terms (e.g., ['Protect confidential information', 'Do not disclose to third parties', 'Obligations survive termination'])"
    )
    
    # ACL compliance
    consumer_guarantees: List[str] = Field(
        default_factory=list,
        description="Array describing ACL consumer guarantees (e.g., ['Services provided with due care and skill', 'Fit for purpose', 'Nothing excludes ACL rights'])"
    )
    
    acl_statement: str = Field(
        ...,
        description="MUST be exactly: 'Nothing in these Terms excludes, restricts or modifies rights under the Australian Consumer Law.'"
    )
    
    # Liability and disclaimers
    liability_limitations: List[str] = Field(
        default_factory=list,
        description="Array of liability limitations (e.g., ['To maximum extent permitted by law', 'Liability capped at fees paid in last 12 months', 'Not liable for indirect losses'])"
    )
    
    disclaimers: List[str] = Field(
        default_factory=list,
        description="Array of disclaimers (e.g., ['Service provided as-is within ACL limits', 'No guarantee of uninterrupted service', 'User responsible for backups'])"
    )
    
    # Termination
    termination_rights: List[str] = Field(
        default_factory=list,
        description="Array describing termination rights (e.g., ['Either party may terminate with notice', 'Immediate termination for breach', 'Data deletion within 30 days'])"
    )
    
    # Dispute resolution
    dispute_resolution_process: List[str] = Field(
        default_factory=list,
        description="Array describing dispute resolution (e.g., ['Contact us first to resolve', 'ACCC or state Fair Trading available', 'Escalate to mediation if needed'])"
    )
    
    governing_law: str = Field(
        ...,
        description="Governing law and jurisdiction (e.g., 'New South Wales, Australia')"
    )
    
    # Support and availability
    support_terms: List[str] = Field(
        default_factory=list,
        description="Array describing support provided (e.g., ['Email support available', 'Response within 2 business days', 'No SLA for free tier'])"
    )
    
    availability_terms: List[str] = Field(
        default_factory=list,
        description="Array describing service availability (e.g., ['99.5% uptime target', 'Scheduled maintenance notified in advance', 'No guarantee of uninterrupted access'])"
    )
    
    # International operations (if applicable)
    international_terms: List[str] = Field(
        default_factory=list,
        description="Array of international operation terms if service operates internationally (e.g., ['Available in multiple countries', 'Currency conversions apply', 'Local laws may apply']). Empty if Australia-only."
    )
    
    # Main sections (full contract text)
    sections: List[ToSSection] = Field(
        default_factory=list,
        description="Array of 18-20 ToS sections with section_number, heading, and content array"
    )