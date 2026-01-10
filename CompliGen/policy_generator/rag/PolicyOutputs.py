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
        default_factory=list,
        description="MUST populate: Array of 10-15 policy sections with section_number, heading, and content"
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