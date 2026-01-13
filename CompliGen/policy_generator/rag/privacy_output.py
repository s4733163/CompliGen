# PrivacyOutput.py

from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List
from datetime import date


def sanitize_plain_text(value: str) -> str:
    """
    Non-destructive sanitiser:
    - Removes newlines
    - Removes markdown bullets/headings
    - Collapses whitespace
    - NEVER raises
    """
    if value is None:
        return ""

    if not isinstance(value, str):
        return str(value)

    text = value.replace("\n", " ").replace("\r", " ")

    prefixes = ("* ", "- ", "• ", "+ ", "# ")
    stripped = text.lstrip()
    for p in prefixes:
        if stripped.startswith(p):
            stripped = stripped[len(p):]
            break

    return " ".join(stripped.split()).strip()


class PolicySubsection(BaseModel):
    subsection_number: str = Field(..., description="e.g., '1.1', '1.2'")
    heading: str = Field(..., description="Subsection heading")
    content: List[str] = Field(..., description="Subsection content as paragraphs")

    @field_validator("heading")
    @classmethod
    def sanitize_heading(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator("content")
    @classmethod
    def sanitize_content(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(item) for item in v]


class PolicySection(BaseModel):
    section_number: int = Field(..., description="Section number (1, 2, 3...)")
    heading: str
    content: List[str]
    subsections: List[PolicySubsection] = Field(
        default_factory=list,
        description="Optional subsections"
    )

    @field_validator("heading")
    @classmethod
    def sanitize_heading(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator("content")
    @classmethod
    def sanitize_content(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(item) for item in v]


class PolicyContactInfo(BaseModel):
    email: str
    phone: Optional[str] = None
    website: str
    postal_address: Optional[str] = None

    @field_validator("email", "website")
    @classmethod
    def sanitize_required_fields(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator("phone", "postal_address")
    @classmethod
    def sanitize_optional_fields(cls, v: Optional[str]) -> Optional[str]:
        return sanitize_plain_text(v) if v is not None else None


class StructuredPrivacyPolicy(BaseModel):
    """
    Complete structured privacy policy rendered component-by-component
    """
    model_config = ConfigDict(extra="forbid")

    # Header
    company_name: str = Field(..., description="Company name")
    last_updated: str = Field(
        ..., description="Date in YYYY-MM-DD format"
    )

    # Introduction
    introduction: List[str] = Field(
        ..., description="Opening paragraphs introducing the policy"
    )

    # Main sections
    sections: List[PolicySection] = Field(
        ..., description="Main policy sections"
    )

    # Complaints and OAIC
    complaints_process: List[str] = Field(
        ..., description="How to lodge a complaint"
    )

    oaic_contact: List[str] = Field(
        ..., description="OAIC contact information"
    )

    # Contact info
    contact_info: PolicyContactInfo = Field(
        ..., description="Company contact details"
    )

    # Metadata
    apps_addressed: List[int] = Field(
        ..., description="List of APP numbers addressed (1–13)"
    )

    @field_validator(
        "company_name",
        "last_updated"
    )
    @classmethod
    def sanitize_single_fields(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator(
        "introduction",
        "complaints_process",
        "oaic_contact"
    )
    @classmethod
    def sanitize_list_fields(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(item) for item in v]
