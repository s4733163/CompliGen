# CookieOutput.py

from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List, Optional

def sanitize_plain_text(value: str) -> str:
    """
    Non-destructive sanitiser:
    - Removes newlines
    - Removes markdown bullets/headings
    - Collapses whitespace
    - NEVER raises
    - NEVER drops content
    """
    if value is None:
        return ""

    if not isinstance(value, str):
        return str(value)

    text = value.replace("\n", " ").replace("\r", " ")

    # Strip markdown-style prefixes (only at start)
    prefixes = ("* ", "- ", "• ", "+ ", "# ")
    stripped = text.lstrip()
    for p in prefixes:
        if stripped.startswith(p):
            stripped = stripped[len(p):]
            break

    # Collapse whitespace
    cleaned = " ".join(stripped.split())

    return cleaned.strip()


class CookieSection(BaseModel):
    section_number: int = Field(..., description="Section number")
    heading: str = Field(..., description="Section heading")
    content: List[str] = Field(
        ..., description="List of plain-text paragraphs/items"
    )

    @field_validator("heading")
    @classmethod
    def sanitize_heading(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator("content")
    @classmethod
    def sanitize_content(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(item) for item in v]


class BrowserInstruction(BaseModel):
    browser_name: str = Field(..., description="Browser name")
    instructions: List[str] = Field(..., description="Cookie management steps")
    help_link: str = Field(..., description="Browser help link")

    @field_validator("browser_name")
    @classmethod
    def sanitize_browser_name(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator("instructions")
    @classmethod
    def sanitize_instructions(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(step) for step in v]

    @field_validator("help_link")
    @classmethod
    def sanitize_help_link(cls, v: str) -> str:
        return sanitize_plain_text(v)


class ThirdPartyService(BaseModel):
    service_name: str = Field(..., description="Service name")
    purpose: List[str] = Field(..., description="Purpose of cookies")
    opt_out_link: Optional[str] = Field(None, description="Opt-out link")

    @field_validator("service_name")
    @classmethod
    def sanitize_service_name(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator("purpose")
    @classmethod
    def sanitize_purpose(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(p) for p in v]

    @field_validator("opt_out_link")
    @classmethod
    def sanitize_opt_out_link(cls, v: Optional[str]) -> Optional[str]:
        return sanitize_plain_text(v) if v is not None else None


class StructuredCookiePolicy(BaseModel):
    """Complete structured cookie policy for frontend rendering."""
    model_config = ConfigDict(extra="forbid")

    # Header
    company_name: str = Field(..., description="Company name")
    last_updated: str = Field(
        ..., 
        description="Date in YYYY-MM-DD format (NOT including 'Last Updated:' text)"
    )

    # Introduction
    introduction: List[str] = Field(..., description="Intro paragraphs")

    # Cookie types
    cookie_types: List[str] = Field(..., description="Types of cookies used")

    # Sections
    sections: List[CookieSection] = Field(..., description="Policy sections")

    # Third-party services
    third_party_services: List[ThirdPartyService] = Field(
        ..., description="Third-party cookie services"
    )

    # Cookie duration
    cookie_duration: List[str] = Field(..., description="Cookie duration statements")

    # Browser instructions
    browser_instructions: List[BrowserInstruction] = Field(
        ..., description="Browser cookie controls"
    )

    # Contact
    contact_email: str = Field(..., description="Contact email")
    contact_phone: Optional[str] = Field(None, description="Contact phone")
    website: str = Field(..., description="Website URL")

    @field_validator(
        "company_name",
        "last_updated",
        "contact_email",
        "website"
    )
    @classmethod
    def sanitize_single_fields(cls, v: str) -> str:
        return sanitize_plain_text(v)

    @field_validator(
        "introduction",
        "cookie_types",
        "cookie_duration"
    )
    @classmethod
    def sanitize_list_fields(cls, v: List[str]) -> List[str]:
        return [sanitize_plain_text(item) for item in v]