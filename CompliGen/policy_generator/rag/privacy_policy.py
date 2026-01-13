import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
import time
from langchain_google_genai import ChatGoogleGenerativeAI
import random
from langchain_core.prompts import ChatPromptTemplate
from datetime import date
from .privacy_output import StructuredPrivacyPolicy


# Load environment
load_dotenv()

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=.3,
    api_key=os.getenv("GOOGLE_API_KEY"),
    streaming=False
)

# Initialize embeddings model
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.environ.get("GOOGLE_API_KEY")
) 

# initialise the vector store
vector_store = Chroma(
    embedding_function=embeddings,  
    collection_name="ingested_law_docs",
    persist_directory="./chroma"
)

# Simple prompt template
prompt_template = ChatPromptTemplate.from_messages([
    ("human", "{input}"),
])

llm_with_structured_output = llm.with_structured_output(StructuredPrivacyPolicy)

chain = prompt_template | llm_with_structured_output

# prompt for privacy policy generation
PRIVACY_POLICY_PROMPT = """
    You are an expert Australian privacy law consultant specializing in drafting Privacy Act 1988 compliant privacy policies. You have deep knowledge of all 13 Australian Privacy Principles (APPs) and create clear, professional privacy policies for Australian businesses.

    === LEGAL REQUIREMENTS ===

    The following are excerpts from the Privacy Act 1988 and Australian Privacy Principles Guidelines that MUST be addressed in this privacy policy:

    {legal_context}

    === INDUSTRY EXAMPLES ===

    Here are examples of how similar companies in the {industry} industry have structured their privacy policies:

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
    - International Operations: {international_operations}
    - Serves Children Under 18: {serves_children}

    Data Collection Information:
    - Types of Personal Information Collected: {data_types}
    - Collection Methods: {collection_methods}
    - Purposes of Collection: {collection_purposes}
    - Third-Party Sharing: {third_parties}
    - Data Storage Location: {storage_location}
    - Security Measures: {security_measures}
    - Data Retention Period: {retention_period}

   === YOUR TASK ===

    Generate a comprehensive Privacy Policy for {company_name} (2,000–3,000 words) that complies with the Australian Privacy Act 1988.

    **COMPLIANCE REQUIREMENTS:**
    - Address all 13 Australian Privacy Principles (APPs).
    - For each APP:
    - Include a clear section or subsection.
    - Apply the APP **only to the extent it is relevant** to the company information provided.
    - Where an APP is not applicable based on the provided information, explicitly state that it does not apply or explain the limited applicability (do not invent practices).
    - Give particular attention to APPs that are triggered by the provided inputs, including but not limited to:
    - APP 1 (Open and transparent management)
    - APP 3 (Collection of solicited personal information)
    - APP 5 (Notification of collection)
    - APP 6 (Use and disclosure)
    - APP 7 (Direct marketing) — only if marketing is indicated
    - APP 8 (Cross-border disclosure) — only if overseas disclosure is indicated
    - APP 11 (Security of personal information)
    - APP 12 (Access)
    - APP 13 (Correction)

    **CONTENT RULES (STRICT):**
    - Use only the company information explicitly provided.
    - Do **not** invent business practices, overseas disclosures, marketing activities, payment processing, cookies, or third-party sharing.
    - Do **not** use placeholders such as “[Insert …]”.
    - Where certain activities are **not** undertaken (e.g. no direct marketing, no overseas disclosure), clearly state that fact in the relevant APP section.

    **MANDATORY SECTIONS:**
    - Collection of Personal Information
    - Use and Disclosure of Personal Information
    - Data Security and Retention
    - Access and Correction
    - Complaints and OAIC Contact
    - How to Contact Us

    **STYLE:**
    - Australian English spelling
    - Clear, accessible language suitable for the general public
    - First person (“we”) and second person (“you”)
    - Professional tone appropriate for the {industry} industry
    - Numbered sections with clear headings aligned to the APPs

    {additional_instructions}

    === OUTPUT ===

    Generate the complete Privacy Policy now.
    Include “Last Updated: {Current_Date}” at the top.

"""

def generate_privacy_policy(
    company_name,
    business_description,
    industry,
    company_size,
    location,
    website,
    contact_email,
    phone_number,
    customer_type,
    international_operations,  # Boolean: True/False
    serves_children,           # Boolean: True/False
    data_types,
    payment_data_collected,    # Boolean: True/False
    cookies_used,              # Boolean: True/False
    collection_methods,
    marketing_purpose,         # Boolean: True/False
    collection_purposes,
    third_parties,             # String
    storage_location,
    security_measures,
    retention_period
):
    today = date.today().strftime("%B %d, %Y")
    # CREATE LOCAL VARIABLES (don't modify globals!)
    legal_query = "privacy policy Australian Privacy Principles collection use disclosure security access correction"
    example_query = "privacy policy"
    
    #  Add conditional keywords (with spaces!)
    if international_operations:
        legal_query += " APP 8 cross-border international overseas"
    
    if serves_children:
        legal_query += " children minors parental consent APP 3"
    
    if third_parties and third_parties.strip():  # ✅ Fixed logic
        legal_query += " APP 6 disclosure third party sharing"
    
    if cookies_used:
        legal_query += " cookies tracking technologies consent"
    
    if payment_data_collected:
        legal_query += " payment sensitive information APP 11 security"
    
    if marketing_purpose:
        legal_query += " APP 7 direct marketing consent opt-out"
    
    # Build example query
    example_query += f" {industry} {customer_type}"


    # RETRIEVAL STEP
    # get the legal docs chunks
    legal_docs = vector_store.similarity_search(
        legal_query,
        k=12,
        filter={"doc_type": "law"}
    )

    # get the example docs chunks
    example_docs = vector_store.similarity_search(
        example_query,
        k=6,
        filter={"doc_type": "example_privacy_policy"}
    )

    # get the legal context
    legal_context = "\n\n---\n\n".join([doc.page_content for doc in legal_docs])

    # get the example context
    example_context = "\n\n---\n\n".join([doc.page_content for doc in example_docs])

    additional_instructions = """
    Do not use placeholders such as [Insert Address Here]. 
    If a postal address is not provided, omit postal address entirely and provide email contact only.

    - Do not write “APP X does not apply”. Instead write what the company does or does not do in practice (e.g., “We do not currently disclose overseas…”).
    - Do not claim we de-identify personal information before all disclosures. Only describe de-identification for analytics/research/statistical purposes.
    - If cookies_used is False, do not mention cookies or tracking. If True, include a Cookies/Tracking section with choices/controls.
    - For APP 5, explicitly state the main consequence if personal information is not provided (e.g., cannot provide the Services).

    - Do NOT state that any Australian Privacy Principle “does not apply”.
    - Where an activity is not undertaken (e.g. direct marketing, overseas disclosure),
    explain this fact in practical terms (e.g. “We do not currently…”)
    and describe what will happen if this changes.
    """

    # AUGUMENTATION STEP
    prompt = PRIVACY_POLICY_PROMPT.format(
        legal_context = legal_context,
        example_context = example_context,
        company_name = company_name,
        business_description = business_description,
        industry = industry,
        company_size = company_size,
        location = location,
        website = website,
        contact_email = contact_email,
        phone_number = phone_number,
        customer_type = customer_type,
        international_operations = international_operations,  
        serves_children = serves_children,         
        data_types = data_types,
        payment_data_collected = payment_data_collected,    
        cookies_used = cookies_used,              
        collection_methods = collection_methods,
        marketing_purpose = marketing_purpose,         
        collection_purposes = collection_purposes,
        third_parties = third_parties,             
        storage_location = storage_location,
        security_measures = security_measures,
        retention_period = retention_period,
        additional_instructions=additional_instructions,
        Current_Date=today
    ) 

    # GENERATION STEP
    result = chain.invoke({"input": prompt})
    print(result.model_dump())
    return result.model_dump()


