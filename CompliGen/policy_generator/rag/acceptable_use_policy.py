import os
from dotenv import load_dotenv
from datetime import datetime
from zoneinfo import ZoneInfo
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from .policy_outputs import StructuredAcceptableUsePolicy

# -----------------------------
# Setup (same as your pattern)
# -----------------------------
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    api_key=os.getenv("GOOGLE_API_KEY"),
    streaming=False,
)

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

vector_store = Chroma(
    embedding_function=embeddings,
    collection_name="ingested_law_docs",
    persist_directory="./chroma",
)

prompt_template = ChatPromptTemplate.from_messages([("human", "{input}")])

llm_with_output = llm.with_structured_output(StructuredAcceptableUsePolicy)

chain = prompt_template | llm_with_output


# -----------------------------
# Acceptable Use Policy (AUP)
# Includes ALL Basic fields + ALL AUP fields
# -----------------------------
AUP_PROMPT = """
You are a compliance and cybersecurity expert specialising in Acceptable Use Policies for SaaS platforms.

Write a complete Acceptable Use Policy for the company described below. The policy must be suitable for Australian businesses and written in Australian English.

IMPORTANT RULES:
- Do NOT invent company facts.
- If a field is not provided, write "Not specified" (do not add guesses).
- Do NOT include placeholders like [Company Name] or <insert>.
- Keep the policy clear and non-technical.
- Be transparent about monitoring and enforcement.

=== LEGAL CONTEXT (RAG) ===
{legal_context}

=== INDUSTRY EXAMPLES (RAG) ===
{example_context}

========================================================
1) BASIC COMPANY INFORMATION (REQUIRED FOR ALL POLICIES)
========================================================
Company name: {company_name}
Business description: {business_description}
Industry type: {industry_type}
Company size: {company_size}
Business location (Australia state/territory): {business_location_state_territory}
Website URL: {website_url}
Contact email: {contact_email}
Phone number (optional): {phone_number}
Customer type (Individuals / Businesses / Both): {customer_type}
International customers (Yes/No + countries): {international_customers}
Children under 18 served (Yes/No): {children_under_18_served}

======================================
2) AUP – PLATFORM CONDUCT (AUP FIELDS)
======================================
Permitted usage types (personal/commercial/educational): {permitted_usage_types}
Prohibited activities: {prohibited_activities}
Industry-specific restrictions: {industry_specific_restrictions}
User monitoring practices: {user_monitoring_practices}
Reporting of illegal activities: {reporting_illegal_activities}

========================
MANDATORY POLICY SECTIONS
========================
1. Last Updated
2. Purpose of This Policy
3. Who This Policy Applies To
4. Permitted Use
5. Prohibited Activities
6. Industry-Specific Restrictions
7. User Content and User Responsibilities (general – do not create ToS terms)
8. Security and Account Protection Expectations
9. Monitoring, Logging, and Enforcement
10. Reporting Illegal or Prohibited Activity
11. Consequences of Breach
12. Changes to This Policy
13. Contact Information

=== OUTPUT FORMAT ===
- Start with: "Last Updated: {today}"
- Then the full policy with headings matching the sections above.
"""


def generate_acceptable_use_policy(
    # --- Basic Company Information (ALL fields) ---
    company_name: str,
    business_description: str,
    industry_type: str,
    company_size: str,
    business_location_state_territory: str,
    website_url: str,
    contact_email: str,
    phone_number: str | None,
    customer_type: str,
    international_customers: str,
    children_under_18_served: str,
    # --- AUP fields (ALL fields) ---
    permitted_usage_types: str,
    prohibited_activities: str,
    industry_specific_restrictions: str,
    user_monitoring_practices: str,
    reporting_illegal_activities: str,
):
    today = datetime.now(ZoneInfo("Australia/Sydney"))
    
    # RAG: legal + examples
    legal_docs = vector_store.similarity_search(
        "acceptable use policy Australia platform misuse monitoring enforcement illegal activity reporting",
        k=8,
        filter={"doc_type": "law"},
    )

    example_docs = vector_store.similarity_search(
        f"acceptable use policy {industry_type} SaaS prohibited activities monitoring enforcement",
        k=8,
        filter={
            "$and": [
                {"doc_type": "example"},
                {"policy_type": "Acceptable Use Policy"},
            ]
        },
    )

    prompt = AUP_PROMPT.format(
        legal_context="\n\n".join(d.page_content for d in legal_docs) or "Not specified",
        example_context="\n\n".join(d.page_content for d in example_docs) or "Not specified",
        company_name=company_name or "Not specified",
        business_description=business_description or "Not specified",
        industry_type=industry_type or "Not specified",
        company_size=company_size or "Not specified",
        business_location_state_territory=business_location_state_territory or "Not specified",
        website_url=website_url or "Not specified",
        contact_email=contact_email or "Not specified",
        phone_number=(phone_number if phone_number else "Not specified"),
        customer_type=customer_type or "Not specified",
        international_customers=international_customers or "Not specified",
        children_under_18_served=children_under_18_served or "Not specified",
        permitted_usage_types=permitted_usage_types or "Not specified",
        prohibited_activities=prohibited_activities or "Not specified",
        industry_specific_restrictions=industry_specific_restrictions or "Not specified",
        user_monitoring_practices=user_monitoring_practices or "Not specified",
        reporting_illegal_activities=reporting_illegal_activities or "Not specified",
        today=today,
    )

    result = chain.invoke({"input": prompt})
    print(result.model_dump())
    return result.model_dump()

"""
generate_acceptable_use_policy(
    company_name="LedgerSafe Pty Ltd",
    business_description="Cloud-based accounting and financial compliance software for small and medium businesses.",
    industry_type="FinTech SaaS",
    company_size="SME (11–50 employees)",
    business_location_state_territory="Victoria",
    website_url="https://ledgersafe.com.au",
    contact_email="legal@ledgersafe.com.au",
    phone_number="+61 3 9000 1122",
    customer_type="Businesses (B2B)",
    international_customers="Yes — Australia and New Zealand",
    children_under_18_served="No",

    permitted_usage_types="Commercial accounting, financial reporting, internal audits",
    prohibited_activities="Unauthorised access; credential sharing; scraping; reverse engineering; uploading unlawful financial data; fraud; impersonation",
    industry_specific_restrictions="No storage of credit card numbers unless PCI-compliant; no use for personal consumer banking decisions",
    user_monitoring_practices="System access logs and audit trails are monitored for compliance and fraud detection",
    reporting_illegal_activities="Report suspected fraud or illegal financial activity via contact email; disclosures may be made to regulators where required"
)

generate_acceptable_use_policy(
    company_name="MediInsights Australia Pty Ltd",
    business_description="Analytics platform providing operational insights for healthcare providers.",
    industry_type="HealthTech analytics",
    company_size="Mid-sized (51–200 employees)",
    business_location_state_territory="Queensland",
    website_url="https://mediinsights.com.au",
    contact_email="compliance@mediinsights.com.au",
    phone_number=None,
    customer_type="Businesses (Healthcare providers)",
    international_customers="No — Australia only",
    children_under_18_served="Yes",

    permitted_usage_types="Clinical operations analysis; workforce planning; internal reporting",
    prohibited_activities="Uploading identifiable patient data without authority; system misuse; data scraping; malware distribution",
    industry_specific_restrictions="No diagnostic or treatment decisions may be made solely using platform outputs",
    user_monitoring_practices="User activity and access logs are monitored; abnormal behaviour may trigger investigation",
    reporting_illegal_activities="Users should report suspected misuse or unlawful activity via email; mandatory reporting obligations apply where required"
)
generate_acceptable_use_policy(
    company_name="LearnSphere Pty Ltd",
    business_description="Online learning management system for vocational and professional training providers.",
    industry_type="EdTech SaaS",
    company_size="Startup (1–10 employees)",
    business_location_state_territory="Western Australia",
    website_url="https://learnsphere.io",
    contact_email="support@learnsphere.io",
    phone_number="+61 8 7000 9988",
    customer_type="Individuals and Businesses",
    international_customers="Yes — Australia, Singapore, India",
    children_under_18_served="Yes",

    permitted_usage_types="Educational delivery; course management; learner assessment",
    prohibited_activities="Harassment; uploading offensive content; copyright infringement; account sharing; security circumvention",
    industry_specific_restrictions="No use of platform for formal accreditation decisions without human review",
    user_monitoring_practices="Platform usage and content moderation systems are in place to detect misuse",
    reporting_illegal_activities="Illegal content or conduct should be reported to support; serious matters may be escalated to authorities"
)

"""
