# data_processing_agreement.py

import os
from dotenv import load_dotenv
from datetime import date

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from PolicyOutputs import StructuredDataProcessingAgreement

# -----------------------------
# Setup
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

llm_with_output = llm.with_structured_output(StructuredDataProcessingAgreement)
chain = prompt_template | llm_with_output


def ns(value: str | None) -> str:
    """Return value or 'Not specified' (strictly, no commentary)."""
    if value is None:
        return "Not specified"
    v = str(value).strip()
    return v if v else "Not specified"


DPA_PROMPT = """
You are a compliance and cybersecurity expert specialising in Data Processing Agreements (DPAs) for Australian SaaS platforms.

Write a complete Data Processing Agreement suitable for an Australian SaaS provider with international customers.
Use clear, non-technical Australian English.

=== CRITICAL AUSTRALIA-FIRST RULES (ABSOLUTE) ===

1) LEGAL FRAMEWORK:
   - PRIMARY LAW: Privacy Act 1988 (Cth) and Australian Privacy Principles (APPs)
   - BREACH SCHEME: Notifiable Data Breaches (NDB) scheme
   - DO NOT reference GDPR articles (Article 28, 32-36, etc.)
   - DO NOT use phrases like "pursuant to GDPR" or "in accordance with GDPR"
   - If obligations mirror GDPR, describe them WITHOUT citing GDPR articles
   - Instead use: "under the Privacy Act 1988 (Cth) and applicable Data Protection Laws"

2) TERMINOLOGY:
   - PRIMARY TERM: "Personal Information" (Privacy Act 1988)
   - SECONDARY TERM: "Personal Data" (explain as equivalent international contract term)
   - "Controller/Processor" are acceptable as contract roles
   - Always relate these roles back to Australian privacy concepts

3) CONTENT RULES:
   - Do NOT invent company facts or details
   - Do NOT include placeholders like [Company Name], <insert>, [ABN], etc.
   - Do NOT quote long passages of legal text verbatim

=== LEGAL CONTEXT (RAG) ===
{legal_context}

=== INDUSTRY EXAMPLES (RAG) ===
{example_context}

========================================================
COMPANY INFORMATION
========================================================
Company name: {company_name}
Business description: {business_description}
Industry type: {industry_type}
Company size: {company_size}
Business location: {business_location_state_territory}
Website: {website_url}
Contact email: {contact_email}
Phone: {phone_number}
Customer type: {customer_type}
International customers: {international_customers}
Children under 18: {children_under_18_served}

Role: {role_controller_or_processor}
Sub-processors: {sub_processors_used}
Processing locations: {data_processing_locations}
Security certs: {security_certifications}
Breach notification: {breach_notification_timeframe}
Deletion timeline: {data_deletion_timelines}
Audit rights: {audit_rights}
Processing summary: {processing_summary}

========================
GENERATE DPA WITH 21 SECTIONS
========================

1. Last Updated
2. Parties and Purpose
3. Definitions (10 terms: Agreement, Controller, Customer, Data Protection Laws, Personal Data, Personal Information, Processor, Processing, Sub-processor, Eligible Data Breach)
4. Roles and Scope
5. Details of Processing
6. Processor Obligations
7. Controller Obligations
8. Confidentiality
9. Security Measures
10. Sub-processors
11. Overseas Disclosures (APP 8)
12. Assistance with Individual Rights
13. Eligible Data Breaches (NDB scheme)
14. Deletion or Return of Data
15. Audits and Compliance
16. Liability
17. Term and Termination
18. Changes to This DPA
19. Contact Information
20. Annex A – Processing Details (leave content empty)
21. Annex B – TOMs (leave content empty)

=== OUTPUT FORMAT ===
Use Australian English spelling. Generate complete DPA starting with "Last Updated: {today}".
"""

def generate_data_processing_agreement(
    # --- Basic Company Information ---
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
    # --- DPA fields ---
    role_controller_or_processor: str,
    sub_processors_used: str,
    data_processing_locations: str,
    security_certifications: str,
    breach_notification_timeframe: str,
    data_deletion_timelines: str,
    audit_rights: str,
    processing_summary: str | None = None,
):
    today = date.today().strftime("%Y-%m-%d")

    # RAG
    legal_docs = vector_store.similarity_search(
        "Australia Privacy Act 1988 APP 8 overseas disclosure Notifiable Data Breaches scheme processor obligations",
        k=8,
        filter={"doc_type": "law"},
    )

    example_docs = vector_store.similarity_search(
        f"Australian SaaS data processing agreement annex security measures sub-processors {industry_type}",
        k=8,
        filter={
            "$and": [
                {"doc_type": "example"},
                {"policy_type": "Data Processing Agreement"},
            ]
        },
    )

    prompt = DPA_PROMPT.format(
        legal_context="\n\n".join(d.page_content for d in legal_docs) or "Not specified",
        example_context="\n\n".join(d.page_content for d in example_docs) or "Not specified",
        company_name=ns(company_name),
        business_description=ns(business_description),
        industry_type=ns(industry_type),
        company_size=ns(company_size),
        business_location_state_territory=ns(business_location_state_territory),
        website_url=ns(website_url),
        contact_email=ns(contact_email),
        phone_number=ns(phone_number),
        customer_type=ns(customer_type),
        international_customers=ns(international_customers),
        children_under_18_served=ns(children_under_18_served),
        role_controller_or_processor=ns(role_controller_or_processor),
        sub_processors_used=ns(sub_processors_used),
        data_processing_locations=ns(data_processing_locations),
        security_certifications=ns(security_certifications),
        breach_notification_timeframe=ns(breach_notification_timeframe),
        data_deletion_timelines=ns(data_deletion_timelines),
        audit_rights=ns(audit_rights),
        processing_summary=ns(processing_summary),
        today=today,
    )

    result = chain.invoke({"input": prompt})
    dpa_dict = result.model_dump()
    
    # ============================================
    # POST-PROCESSING: FILL EMPTY FIELDS
    # ============================================
    
    # 1. Top-level fields
    if not dpa_dict['breach_notification_timeframe']:
        dpa_dict['breach_notification_timeframe'] = [breach_notification_timeframe]
    
    if not dpa_dict['data_deletion_timelines']:
        dpa_dict['data_deletion_timelines'] = [data_deletion_timelines]
    
    if not dpa_dict['audit_rights']:
        dpa_dict['audit_rights'] = [audit_rights]
    
    if not dpa_dict['data_processing_locations']:
        locations = [loc.strip() for loc in data_processing_locations.split(';')]
        dpa_dict['data_processing_locations'] = locations
    
    # 2. Definitions
    if not dpa_dict['definitions']['terms']:
        dpa_dict['definitions']['terms'] = [
            "Agreement: The main service agreement between the parties to which this DPA is appended.",
            "Controller: The entity that determines the purposes and means of processing Personal Information.",
            "Customer: The entity that has entered into the Agreement with the Processor.",
            "Data Protection Laws: All applicable laws relating to Personal Information, including the Privacy Act 1988 (Cth) and the APPs.",
            "Personal Data: Information relating to an identified or identifiable natural person (equivalent to Personal Information, used in international contracts).",
            "Personal Information: Information or an opinion about an identified individual, or an individual who is reasonably identifiable, as defined in the Privacy Act 1988 (Cth).",
            "Processor: The entity that processes Personal Information on behalf of the Controller.",
            "Processing: Any operation performed on Personal Information, such as collection, recording, organisation, storage, use, disclosure, or destruction.",
            "Sub-processor: Any third party engaged by the Processor to process Personal Information on behalf of the Customer.",
            "Eligible Data Breach: A breach likely to result in serious harm to individuals, as defined under the NDB scheme of the Privacy Act 1988 (Cth)."
        ]
    
    # 3. Annex A
    if not dpa_dict['annex_a']['subject_matter_of_processing']:
        dpa_dict['annex_a']['subject_matter_of_processing'] = [
            processing_summary or "Customer uploads datasets. Platform stores, analyses, and generates reports."
        ]
    
    if not dpa_dict['annex_a']['duration_of_processing']:
        dpa_dict['annex_a']['duration_of_processing'] = ["For the term of the Agreement"]
    
    if not dpa_dict['annex_a']['nature_and_purpose_of_processing']:
        dpa_dict['annex_a']['nature_and_purpose_of_processing'] = [
            f"To provide the {company_name} platform",
            "To store, analyse, and generate reports based on customer data",
            "To provide customer support and maintain the service"
        ]
    
    if not dpa_dict['annex_a']['categories_of_data_subjects']:
        if "Businesses" in customer_type or "Business" in customer_type:
            dpa_dict['annex_a']['categories_of_data_subjects'] = [
                "Business customers' employees",
                "End customers",
                "Sales contacts",
                "Support inquiries"
            ]
        else:
            dpa_dict['annex_a']['categories_of_data_subjects'] = [
                "Individual customers",
                "Website visitors",
                "Service users"
            ]
    
    if not dpa_dict['annex_a']['types_of_personal_information']:
        dpa_dict['annex_a']['types_of_personal_information'] = [
            "Names",
            "Email addresses",
            "Phone numbers",
            "Business contact details",
            "Transaction data",
            "Customer identifiers",
            "Usage data"
        ]
    
    if not dpa_dict['annex_a']['data_processing_locations']:
        locations = [loc.strip() for loc in data_processing_locations.split(';')]
        dpa_dict['annex_a']['data_processing_locations'] = locations
    
    if not dpa_dict['annex_a']['sub_processors']:
        categories = [cat.strip() for cat in sub_processors_used.split(';')]
        dpa_dict['annex_a']['sub_processors'] = [
            {"category_name": cat, "provider_names": []} for cat in categories
        ]
    
    # 4. Annex B
    if not dpa_dict['annex_b']['technical_measures']:
        dpa_dict['annex_b']['technical_measures'] = [
            "Encryption of Personal Information at rest and in transit (AES-256 or equivalent)",
            "Multi-factor authentication for access to systems containing Personal Information",
            "Network security controls including firewalls and intrusion detection",
            "Regular security monitoring and logging",
            "Secure software development practices",
            "Regular vulnerability assessments and patching"
        ]
    
    if not dpa_dict['annex_b']['organisational_measures']:
        dpa_dict['annex_b']['organisational_measures'] = [
            "Access controls based on role and need-to-know principle",
            "Background checks for personnel with access to Personal Information",
            "Confidentiality agreements for all personnel",
            "Regular security awareness training",
            "Incident response and business continuity procedures",
            "Documented policies for data handling and security",
            "Regular review and testing of security measures"
        ]
    
    if not dpa_dict['annex_b']['physical_security_measures']:
        dpa_dict['annex_b']['physical_security_measures'] = [
            "Secure data centre facilities with access controls",
            "Environmental controls and redundancy",
            "Secure disposal of media containing Personal Information"
        ]
    
    # security_certifications stays empty if "Not specified"
    if security_certifications != "Not specified" and not dpa_dict['annex_b']['security_certifications']:
        dpa_dict['annex_b']['security_certifications'] = [security_certifications]
    
    # 5. Fix phone_number
    if dpa_dict.get('phone_number') == "Not specified":
        dpa_dict['phone_number'] = None
    
    return dpa_dict


# -----------------------------
# Example usage
# -----------------------------
dpa = generate_data_processing_agreement(
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

    role_controller_or_processor="Processor (ClearView processes personal information on behalf of business customers)",
    sub_processors_used="Cloud hosting provider; Analytics/logging provider; Email delivery provider",
    data_processing_locations="Australia; Other locations used by approved sub-processors",
    security_certifications="Not specified",

    breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach or suspected compromise involving Personal Information",
    data_deletion_timelines="Within 30 days of termination or upon written request, unless retention is required by law",
    audit_rights="Reasonable audit rights on reasonable notice, subject to confidentiality and security constraints",

    processing_summary="Customer uploads or connects sales/customer datasets. Platform stores, analyses, and generates dashboards and reports. Support staff may access data only to provide support and maintain the service.",
)

print(dpa)