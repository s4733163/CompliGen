import os
from dotenv import load_dotenv
from datetime import date

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate

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
chain = prompt_template | llm


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
   - If a field says "Not specified", write EXACTLY: "Not specified" (no elaboration)

4) INFERENCE RULES (for Annexes):
   When specific details are "Not specified", intelligently infer reasonable content based on:
   - The processing_summary provided
   - The industry_type and business_description
   - The customer_type
   - Standard {industry_type} practices
   
   For Annex A, ALWAYS infer from context:
   - Categories of Data Subjects (e.g., if customer_type="Businesses", infer: business employees, customers, contacts)
   - Types of Personal Information (e.g., if processing_summary mentions "customer datasets", infer: names, contact details, transaction data)
   - Nature and purpose of processing (from processing_summary)
   
   For Annex B, if security_certifications="Not specified":
   - Provide generic but reasonable TOMs for a {industry_type} business
   - Include: encryption, access controls, monitoring, incident response, employee training
   - Do NOT overpromise or invent specific certifications

=== LEGAL CONTEXT (RAG) ===
{legal_context}

=== INDUSTRY EXAMPLES (RAG) ===
{example_context}

========================================================
1) BASIC COMPANY INFORMATION
========================================================
Company name: {company_name}
Business description: {business_description}
Industry type: {industry_type}
Company size: {company_size}
Business location (Australia state/territory): {business_location_state_territory}
Website URL: {website_url}
Contact email: {contact_email}
Phone number: {phone_number}
Customer type (Individuals / Businesses / Both): {customer_type}
International customers (Yes/No + countries): {international_customers}
Children under 18 served (Yes/No): {children_under_18_served}

========================================================
2) DPA FIELDS
========================================================
Contract role (Controller/Processor): {role_controller_or_processor}
Sub-processors used: {sub_processors_used}
Data processing locations: {data_processing_locations}
Security certifications: {security_certifications}
Breach notification timeframe: {breach_notification_timeframe}
Data deletion timelines: {data_deletion_timelines}
Audit rights: {audit_rights}
Additional processing summary: {processing_summary}

========================
MANDATORY DPA SECTIONS
========================

1. Last Updated

2. Parties and Purpose
   - Identify parties and state this DPA supplements the main service agreement

3. Definitions
   - Define: Agreement, Controller, Customer, Data Protection Laws, Personal Data, Personal Information, Processor, Processing, Sub-processor, Eligible Data Breach
   - PRIMARY: Use "Personal Information" as defined in Privacy Act 1988 (Cth)
   - CLARIFY: "Personal Data" is equivalent term used in international contracts
   - NO GDPR article references

4. Roles and Scope
   - State whether {company_name} is Processor or Controller
   - Describe scope of processing
   - Processing only per Customer instructions

5. Details of Processing
   - Reference Annex A for full details

6. Processor Obligations
   - Process only on documented instructions
   - Ensure personnel confidentiality
   - Implement appropriate security measures
   - Notify Customer of Eligible Data Breaches
   - Assist with compliance under Privacy Act 1988 (Cth) and applicable Data Protection Laws
   - Allow audits
   - Inform Customer if instruction may breach Data Protection Laws
   - DO NOT reference "Article 28" or "Articles 32-36" - describe obligations WITHOUT GDPR citations

7. Controller Obligations
   - Customer warrants compliance with Data Protection Laws
   - Customer has legal basis for processing
   - Customer instructions are lawful

8. Confidentiality
   - Treat Personal Information as confidential
   - Personnel bound by confidentiality

9. Security Measures
   - Describe appropriate technical and organisational measures:
     * Encryption (at rest and in transit)
     * Access controls and authentication
     * Security monitoring and logging
     * Incident response procedures
     * Employee security training and confidentiality
     * Regular security assessments
   - If {security_certifications} provided, mention them
   - If "Not specified", provide generic but reasonable measures for {industry_type}
   - State: measures appropriate to risk, nature of data, and processing context

10. Sub-processors
    - List actual sub-processors if provided: {sub_processors_used}
    - If only categories provided, list categories
    - State: Sub-processor agreements contain equivalent data protection obligations
    - Processor remains liable for Sub-processor performance

11. Overseas Disclosures and International Data Transfers
    - APP 8 compliant: take reasonable steps to ensure overseas recipients don't breach APPs
    - Implement contractual clauses requiring APP-consistent protection
    - Conduct due diligence on overseas recipients
    - If {international_customers} mentions countries, reference them
    - NO GDPR Standard Contractual Clauses language unless specifically about GDPR compliance

12. Assistance with Individual Rights
    - Assist Customer with facilitating rights under Data Protection Laws:
      * Access to Personal Information
      * Correction of Personal Information
      * Deletion/erasure
      * Restriction of processing
    - Provide assistance within reasonable timeframes

13. Eligible Data Breaches (Notification)
    - Timeframe: {breach_notification_timeframe}
    - Notification must include: nature of breach, data affected, mitigation steps, recommendations
    - Cooperate with Customer on NDB scheme obligations under Privacy Act 1988 (Cth)
    - Support Customer's assessment of whether breach is "Eligible Data Breach"

14. Deletion or Return of Data
    - Timeline: {data_deletion_timelines}
    - Securely delete or return all Personal Information
    - Exception: retention required by law
    - Provide written confirmation when complete

15. Audits and Compliance
    - Customer audit rights: {audit_rights}
    - Processor provides information to demonstrate compliance
    - Reasonable notice, confidentiality, and security constraints apply

16. Liability
    - Subject to limitations in main Agreement
    - Clarify what CANNOT be limited:
      * Fraud or wilful misconduct
      * Gross negligence
      * Breach of confidentiality obligations
      * Any liability that cannot be limited under applicable law
    - Processor liable for Sub-processor acts/omissions as its own
    - Each party indemnifies the other for breaches of this DPA

17. Term and Termination
    - Remains in effect for duration of Agreement
    - Termination of Agreement terminates DPA
    - Sections on confidentiality, liability, and data deletion survive termination

18. Changes to This DPA
    - Processor may update DPA
    - Customer notified of material changes
    - Continued use after notice constitutes acceptance

19. Contact Information
    - Provide: {contact_email}
    - If {phone_number} provided, include it

20. Annex A – Processing Details
    Complete this section by inferring from context:
    
    - Subject matter of processing: {processing_summary}
    - Duration: For the term of the Agreement
    - Nature and purpose of processing: [Infer from {processing_summary} and {business_description}]
    
    - Categories of Data Subjects: 
      [Infer from {customer_type} and {processing_summary}]
      Example: If customer_type="Businesses" and processing involves "customer datasets", infer:
      "Business customers' employees, end customers, sales contacts, support inquiries"
    
    - Types of Personal Information processed:
      [Infer from {processing_summary}]
      Example: If processing_summary mentions "sales/customer datasets", infer:
      "Names, email addresses, phone numbers, business contact details, transaction data, customer identifiers, usage data"
    
    - Data processing locations: {data_processing_locations}
    
    - Sub-processors: {sub_processors_used}

21. Annex B – Technical and Organisational Measures (TOMs)
    
    If {security_certifications} = "Not specified", provide reasonable TOMs for {industry_type}:
    
    **Technical Measures:**
    - Encryption of Personal Information at rest and in transit (AES-256 or equivalent)
    - Multi-factor authentication for access to systems containing Personal Information
    - Network security controls including firewalls and intrusion detection
    - Regular security monitoring and logging
    - Secure software development practices
    - Regular vulnerability assessments and patching
    
    **Organisational Measures:**
    - Access controls based on role and need-to-know principle
    - Background checks for personnel with access to Personal Information
    - Confidentiality agreements for all personnel
    - Regular security awareness training
    - Incident response and business continuity procedures
    - Documented policies for data handling and security
    - Regular review and testing of security measures
    
    **Physical Security:**
    - Secure data centre facilities with access controls
    - Environmental controls and redundancy
    - Secure disposal of media containing Personal Information
    
    If {security_certifications} provided, state: "The Processor holds the following certifications: {security_certifications}"

=== FINAL CHECKS BEFORE OUTPUT ===

1. Search your output for "GDPR", "Article 28", "Article 32", "Articles 32-36"
   - If found, REMOVE and replace with Australian law references
   
2. Search for "[", "]", "<", ">" symbols
   - If found in placeholder context, REMOVE them
   
3. Check Annex A and B
   - If they contain "Not specified" as the ONLY content, you did it WRONG
   - Use inference rules to populate them appropriately
   
4. Check all company details
   - Ensure {company_name}, {contact_email}, {website_url} are used exactly as provided
   - No invented ABNs, addresses, or other details

=== OUTPUT FORMAT ===
Start with: "Last Updated: {today}"
Then output the complete DPA with numbered sections 1-21 matching the structure above.

Use clear headings. Use Australian English spelling throughout.
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
    today = date.today().strftime("%B %d, %Y")

    # RAG: use AU-focused queries as well as international terms
    legal_docs = vector_store.similarity_search(
        "Australia Privacy Act 1988 APP 8 overseas disclosure Notifiable Data Breaches scheme eligible data breach notification processor obligations",
        k=8,
        filter={"doc_type": "law"},
    )

    example_docs = vector_store.similarity_search(
        f"Australian SaaS data processing agreement annex security measures sub-processors overseas disclosure {industry_type}",
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

    return chain.invoke({"input": prompt})


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
    sub_processors_used="Cloud hosting provider; analytics/logging provider; email delivery provider",
    data_processing_locations="Australia; other locations used by approved sub-processors",
    security_certifications="Not specified",

    # AU-first wording: do NOT force GDPR 72h unless you truly want it
    breach_notification_timeframe="Without undue delay after becoming aware of an Eligible Data Breach or suspected compromise involving Personal Information",
    data_deletion_timelines="Within 30 days of termination or upon written request, unless retention is required by law",
    audit_rights="Reasonable audit rights on reasonable notice, subject to confidentiality and security constraints",

    processing_summary="Customer uploads or connects sales/customer datasets. Platform stores, analyses, and generates dashboards and reports. Support staff may access data only to provide support and maintain the service.",
)

print(dpa.content)
