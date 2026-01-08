import os
from dotenv import load_dotenv
from datetime import date

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate

# -----------------------------
# Setup (same as your pattern)
# -----------------------------
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    api_key=os.getenv("GOOGLE_API_KEY"),
    streaming=True,
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
chain = prompt_template | llm


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
    today = date.today().strftime("%B %d, %Y")

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

    return chain.invoke({"input": prompt})

policy = generate_acceptable_use_policy(
    # --- Basic Company Information ---
    company_name="ClearView Analytics Pty Ltd",
    business_description="A cloud-based analytics platform that helps small and medium businesses visualise sales and customer data.",
    industry_type="Software as a Service (SaaS)",
    company_size="Small business (under 50 employees)",
    business_location_state_territory="New South Wales",
    website_url="https://www.clearviewanalytics.com.au",
    contact_email="support@clearviewanalytics.com.au",
    phone_number=None,
    customer_type="Businesses",
    international_customers="Yes – New Zealand, Singapore",
    children_under_18_served="No",

    # --- AUP Fields ---
    permitted_usage_types="Commercial business analytics and internal reporting",
    prohibited_activities="Unauthorised access, scraping, resale of the service, uploading malicious code, harassment, or unlawful data processing",
    industry_specific_restrictions="The platform must not be used to process health records, credit reports, or other regulated personal data without appropriate legal authority",
    user_monitoring_practices="Usage logs, access logs, and security events are monitored to detect misuse, fraud, and security incidents",
    reporting_illegal_activities="Suspected illegal activity may be reported to Australian law enforcement or relevant regulators where required by law",
)

print(policy.content)
