import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
import time
from langchain_google_genai import ChatGoogleGenerativeAI
import random
from langchain_core.prompts import ChatPromptTemplate
from datetime import date

# Load environment
load_dotenv()

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=.3,
    api_key=os.getenv("GOOGLE_API_KEY"),
    streaming=True
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

chain = prompt_template | llm

COOKIE_POLICY_PROMPT = """
You are an expert in privacy law and online tracking technologies. You specialize in drafting clear, compliant cookie policies that explain tracking technologies in accessible language while meeting Australian Privacy Act requirements.

=== LEGAL REQUIREMENTS ===

The following are excerpts from the Privacy Act 1988 and privacy guidelines about cookies and tracking technologies:

{legal_context}

=== INDUSTRY EXAMPLES ===

Here are examples of how similar companies in the {industry} industry have structured their cookie policies:

{example_context}

=== COMPANY INFORMATION ===

Company Details:
- Company Name: {company_name}
- Business Description: {business_description}
- Industry: {industry}
- Website: {website}
- Contact Email: {contact_email}
- Phone: {phone_number}

Cookie Information:
- Essential Cookies: {essential_cookies}
- Analytics Cookies: {analytics_cookies}
- Marketing Cookies: {marketing_cookies}
- Advertising Cookies: {advertising_cookies}
- Functional Cookies: {functional_cookies}
- Third-Party Services: {third_party_services}
- Cookie Duration: {cookie_duration}

=== YOUR TASK ===

Generate a clear Cookie Policy for {company_name} (800-1,500 words) that:

**COMPLIANCE:**
- Complies with Privacy Act notification requirements
- Explains tracking technologies transparently
- Provides opt-out mechanisms
- Lists all third-party cookies

**MANDATORY SECTIONS:**
1. What Are Cookies? (simple explanation)
2. Types of Cookies We Use
   - Essential cookies (if used)
   - Analytics cookies (if used)
   - Marketing cookies (if used)
   - Advertising cookies (if used)
   - Functional cookies (if used)
3. Why We Use Cookies (specific purposes)
4. Third-Party Cookies (list all services)
5. Cookie Duration and Expiry
6. How to Manage Cookies
   - Browser-specific instructions (Chrome, Firefox, Safari, Edge)
   - Third-party opt-out links
7. Changes to This Policy
8. Contact Us

**CONTENT:**
- Uses specific company information provided (no placeholders)
- Lists ONLY the cookie types actually used
- Names specific third-party services (e.g., "Google Analytics", "Facebook Pixel")
- Provides actual opt-out links for third parties
- Includes browser-specific cookie management instructions

**STYLE:**
- Australian English spelling
- Very clear, accessible language (non-technical audience)
- Avoid excessive legal jargon
- Use bullet points for cookie types and third parties
- Professional but friendly tone
- Short paragraphs for readability

**BROWSER INSTRUCTIONS:**
Include specific links for:
- Google Chrome
- Mozilla Firefox
- Apple Safari
- Microsoft Edge
- Mobile browsers (iOS/Android)

**THIRD-PARTY OPT-OUTS:**
Include opt-out links for:
- Google Analytics: https://tools.google.com/dlpage/gaoptout/
- Google Ads: https://adssettings.google.com/
- Facebook: https://www.facebook.com/settings?tab=ads
(Add others based on services used)

{additional_instructions}

=== OUTPUT ===

Generate the complete Cookie Policy now. Include "Last Updated: [Current Date]" at the top.

Cookie Policy:
"""

def generate_cookie_policy(
    # Basic Company Info (minimal)
    company_name,
    business_description,
    industry,
    website,
    contact_email,
    phone_number,
    
    # Cookie Specific Parameters
    essential_cookies,      # Boolean: True (usually always True)
    analytics_cookies,      # Boolean: True/False
    marketing_cookies,      # Boolean: True/False
    advertising_cookies,    # Boolean: True/False
    functional_cookies,     # Boolean: True/False
    
    # Third-party services (list)
    third_party_services,   # List: ["Google Analytics", "Facebook Pixel", "Hotjar"]
    
    # Cookie duration
    cookie_duration,        # String: "Session cookies deleted on browser close. Analytics cookies persist for 2 years."
):
    pass