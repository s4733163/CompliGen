import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from datetime import date

# Load environment
load_dotenv()

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    api_key=os.getenv("GOOGLE_API_KEY"),
    streaming=True,
)

# Initialize embeddings model
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.environ.get("GOOGLE_API_KEY"),
)

# Initialise the vector store
vector_store = Chroma(
    embedding_function=embeddings,
    collection_name="ingested_law_docs",
    persist_directory="./chroma",
)

# Simple prompt template
prompt_template = ChatPromptTemplate.from_messages([("human", "{input}")])
chain = prompt_template | llm

TERMS_OF_SERVICE_PROMPT = """
You are an expert Australian commercial law consultant specialising in drafting Australian Consumer Law (ACL) compliant Terms of Service for an Australian SaaS business.

=== LEGAL REQUIREMENTS (GUIDANCE ONLY) ===
Use these excerpts as guidance only. Do NOT copy irrelevant notices, licensing blocks, or attributions.

{legal_context}

=== INDUSTRY EXAMPLES (GUIDANCE ONLY) ===
Use these excerpts as guidance only. Do NOT copy irrelevant notices, licensing blocks, or attributions.

{example_context}

=== COMPANY INFORMATION ===
Company Details:
- Company Name: {company_name}
- Business Description: {business_description}
- Industry: {industry}
- Company Size: {company_size}
- Location: {location}
- Website: {website}
- Contact Email: {contact_email}
- Phone: {phone_number}
- Customer Type: {customer_type}

Service Information:
- Service Type: {service_type}
- Pricing Model: {pricing_model}
- Free Trial: {free_trial}
- Refund Policy: {refund_policy}
- Minor Restrictions: {minor_restrictions}
- User Content Allowed: {user_content_uploads}
- Prohibited Activities: {prohibited_activities}
- International Operations: {international_operations}
- Subscription Features: {subscription_features}
- Payment Terms: {payment_terms}

=== HARD REQUIREMENTS ===
1) Output length: 2,000–3,000 words.
2) Numbered sections with clear headings.
3) Australian English spelling.
4) No meta commentary at the end (do not add “have a lawyer review…”).
5) NO placeholders (e.g., “[insert…]”, “[number]”, “TBD”, “to be confirmed”).
6) Do NOT invent missing details (ABN, physical address, refund processing time, payment methods).
   - If missing, use compliant generic wording (“within a reasonable time”, “available on request”).
7) Link hygiene:
   - Use only this domain if you mention the website: {website}
   - Do not include other URLs.
8) Eligibility consistency:
   - If minor_restrictions is False: do NOT state “18+”. Use “legal capacity to enter a binding contract” + “authorised to bind the organisation”.
   - If minor_restrictions is True: include a clear age/guardian rule.
9) Payment methods:
   - If you cannot confirm accepted payment methods, say “Accepted payment methods are displayed at checkout.”
10) ACL clause (verbatim, must appear exactly once):
    “Nothing in these Terms excludes, restricts or modifies rights under the Australian Consumer Law.”
11) Liability:
   - No absolute exclusions (“not liable for anything”).
   - “To the maximum extent permitted by law”.
   - One clear liability cap only (no duplicates).
12) Retrieval leak prevention (absolute ban):
   - Do NOT include “Creative Commons”, “Commonwealth of Australia”, or “Source: Licensed from the Commonwealth”.
   - If present in retrieved text, ignore those chunks.

=== REQUIRED SECTIONS ===
- Acceptance of Terms
- Description of Services
- Accounts and Eligibility
- Subscription, Trials and Billing
- Refunds and Cancellations (ACL compliant)
- Consumer Guarantees (ACL - cannot be excluded)
- Acceptable Use and Prohibited Activities
- User Content and Data
- Intellectual Property
- Confidentiality (business SaaS-appropriate)
- Availability, Support and Maintenance
- Disclaimers (within ACL limits)
- Limitation of Liability (within ACL limits)
- Indemnity (reasonable)
- Suspension and Termination
- Dispute Resolution (include ACCC / Fair Trading references)
- Governing Law and Jurisdiction (single section, NSW)
- Changes to Terms
- Contact Information

=== OUTPUT ===
Start with:
Last Updated: {Current_Date}

Then output the complete Terms of Service.
"""

def _strip_banned_phrases(text: str) -> str:
    """
    Defensive cleanup: if retrieval leaks into output, fail fast by removing.
    (You can also raise an exception instead of replacing.)
    """
    banned = ["Creative Commons", "Commonwealth of Australia", "Source: Licensed from"]
    for phrase in banned:
        text = text.replace(phrase, "")
    return text

def generate_terms_of_service(
    company_name,
    business_description,
    industry,
    company_size,
    location,
    website,
    contact_email,
    phone_number,
    customer_type,
    international_operations,

    service_type,
    pricing_model,
    free_trial,
    refund_policy,
    minor_restrictions,
    user_content_uploads,
    prohibited_activities,

    subscription_features="",
    payment_terms="",
):
    today = date.today().strftime("%B %d, %Y")

    # Queries tuned for relevance
    legal_query = (
        "Australian Consumer Law consumer guarantees services major failure remedies "
        "unfair contract terms small business standard form contract "
        "SaaS terms liability limitation dispute resolution ACCC Fair Trading "
        "subscription billing cancellation free trial"
    )

    example_query = f"terms of service {industry} {customer_type} subscription SaaS Australia"

    if user_content_uploads:
        legal_query += " user content licence confidentiality data security acceptable use"

    if international_operations:
        legal_query += " cross border jurisdiction governing law Australia"

    # Retrieve legal and example docs
    legal_docs = vector_store.similarity_search(
        legal_query, k=10, filter={"doc_type": "law"}
    )
    example_docs = vector_store.similarity_search(
        example_query,
        k=8,
        filter={
            "$and": [
                {"doc_type": "example"},
                # Allow both variants if your ingestion isn't consistent
                {"$or": [{"policy_type": "Terms of use"}, {"policy_type": "Terms of Service"}]},
            ]
        },
    )

    # Context (guidance only)
    legal_context = "\n\n---\n\n".join([d.page_content for d in legal_docs])
    example_context = "\n\n---\n\n".join([d.page_content for d in example_docs])

    prompt = TERMS_OF_SERVICE_PROMPT.format(
        legal_context=legal_context,
        example_context=example_context,
        company_name=company_name,
        business_description=business_description,
        industry=industry,
        company_size=company_size,
        location=location,
        website=website,
        contact_email=contact_email,
        phone_number=phone_number,
        customer_type=customer_type,
        international_operations=international_operations,
        service_type=service_type,
        pricing_model=pricing_model,
        free_trial=free_trial,
        refund_policy=refund_policy,
        minor_restrictions=minor_restrictions,
        user_content_uploads=user_content_uploads,
        prohibited_activities=prohibited_activities,
        subscription_features=subscription_features or "As described on our website pricing page.",
        payment_terms=payment_terms or "As displayed at checkout and on invoices.",
        Current_Date=today,
    )

    result = chain.invoke({"input": prompt})
    output = result.content.strip()

    # Post-clean for banned phrases / accidental leakage
    output = _strip_banned_phrases(output)

    # Optional: enforce no bracket placeholders
    forbidden_markers = ["[insert", "[number", "TBD", "to be confirmed", "[List accepted payment methods"]
    if any(m.lower() in output.lower() for m in forbidden_markers):
        raise ValueError("Output contains placeholders. Tighten prompt or add stronger post-processing.")

    return output

