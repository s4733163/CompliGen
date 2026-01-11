import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
import time
from langchain_google_genai import ChatGoogleGenerativeAI
import random
from langchain_core.prompts import ChatPromptTemplate
from datetime import date
from cookie_output import StructuredCookiePolicy

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

llm_with_output = llm.with_structured_output(StructuredCookiePolicy)

chain = prompt_template | llm_with_output

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
    """
    Returns an AIMessage (LangChain) from the LLM (same pattern as your other generators).
    You can access the text via `result.content`.
    """

    today = date.today().strftime("%B %d, %Y")

    # -----------------------------
    # 1) Build retrieval queries
    # -----------------------------
    legal_query = (
        "cookie policy Australia Privacy Act 1988 APP notice cookies tracking technologies "
        "online identifiers analytics advertising opt out consent"
    )

    example_query = f"cookie policy {industry} {company_name} tracking technologies analytics cookies"

    # Boost legal query based on flags
    if analytics_cookies:
        legal_query += " analytics cookies Google Analytics measurement"
        example_query += " analytics"
    if marketing_cookies or advertising_cookies:
        legal_query += " marketing cookies advertising cookies targeted advertising opt out"
        example_query += " marketing advertising"
    if functional_cookies:
        legal_query += " functional cookies preferences"
        example_query += " functional"

    # -----------------------------
    # 2) Retrieve legal + example context
    # -----------------------------
    legal_docs = vector_store.similarity_search(
        legal_query,
        k=8,
        filter={"doc_type": "law"}
    )

    example_docs = vector_store.similarity_search(
        example_query,
        k=6,
        filter={
            "$and": [
                {"doc_type": "example"},
                {"policy_type": "Cookies Policy"}
            ]
        }
    )

    legal_context = "\n\n---\n\n".join([doc.page_content for doc in legal_docs])
    example_context = "\n\n---\n\n".join([doc.page_content for doc in example_docs])

    # -----------------------------
    # 3) Third-party opt-out links (NO fabrication)
    #    - Only include links we can confidently provide.
    #    - For unknown services: no URL; require provider controls instead.
    # -----------------------------
    third_party_opt_out_map = {
        # Google
        "Google Analytics": "https://tools.google.com/dlpage/gaoptout/",
        "Google Ads": "https://adssettings.google.com/",
        "Google Tag Manager": "https://adssettings.google.com/",

        # Meta
        "Facebook": "https://www.facebook.com/settings?tab=ads",
        "Facebook Pixel": "https://www.facebook.com/settings?tab=ads",
        "Meta Pixel": "https://www.facebook.com/settings?tab=ads",
        "Instagram": "https://www.facebook.com/settings?tab=ads",

        # Microsoft
        "Microsoft Advertising": "https://account.microsoft.com/privacy/ad-settings/",

        # LinkedIn
        "LinkedIn Insight Tag": "https://www.linkedin.com/psettings/advertising/actions-that-showed-interest",

        # TikTok
        "TikTok Pixel": "https://www.tiktok.com/legal/page/row/privacy-policy/en",

        # Hotjar (no single global opt-out URL; provide non-link instruction via model)
        # Leave out to avoid inventing an inaccurate opt-out link.
    }

    # Normalise + dedupe services
    # third party services properly formatted
    services = []
    for s in (third_party_services or []):
        if not s:
            continue
        s_clean = " ".join(str(s).split()).strip()
        # do not add redundant services
        if s_clean and s_clean not in services:
            services.append(s_clean)

    # services to which we can provide the links
    # services that we can't provide the links to
    recognised_services_with_links = []
    unrecognised_services = []

    for s in services:
        if s in third_party_opt_out_map:
            recognised_services_with_links.append((s, third_party_opt_out_map[s]))
        else:
            unrecognised_services.append(s)

    # -----------------------------
    # 4) Browser help links (stable vendor help pages)
    # -----------------------------
    browser_help_links = {
        "Chrome": "https://support.google.com/chrome/answer/95647",
        "Firefox": "https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox",
        "Safari (macOS)": "https://support.apple.com/en-au/guide/safari/sfri11471/mac",
        "Edge": "https://support.microsoft.com/en-au/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
        "iPhone/iPad (iOS Safari)": "https://support.apple.com/en-au/HT201265",
        "Android (Chrome)": "https://support.google.com/chrome/answer/95647",
    }

    # -----------------------------
    # 5) Additional instructions (concise, strict)
    # -----------------------------
    additional_instructions = f"""
        === ADDITIONAL INSTRUCTIONS (QUALITY + SAFETY GUARDRAILS) ===

        1) NO PLACEHOLDERS / NO FABRICATION
        - Do not output placeholders like "[insert...]" or "TBD".
        - Do not invent missing company details (ABN, address, cookie vendor lists not provided).
        - If info is missing, use a compliant general statement.

        2) ONLY INCLUDE USED COOKIE TYPES
        - Only include sections for cookie categories that are TRUE in inputs:
        essential={essential_cookies}, analytics={analytics_cookies}, marketing={marketing_cookies},
        advertising={advertising_cookies}, functional={functional_cookies}.
        - If a category is False, do not mention it.

        3) THIRD-PARTY SERVICES: STRICT LINK HYGIENE
        - Only name third-party services provided in input list.
        - For opt-out links, ONLY include links explicitly provided in the prompt below.
        - If a service has no opt-out link provided, state that opt-out options are available via the provider’s privacy/advertising settings without adding a URL.

        4) WEBSITE / LINKS
        - Use only the provided website domain for CompliGen references: {website}
        - Do not add other CompliGen URLs or paths.
        - You MAY include the browser help links and the third-party opt-out links provided below (they are vendor links).

        5) AUSTRALIAN ENGLISH + CLEAR LANGUAGE
        - Use Australian spelling.
        - Non-technical wording, short paragraphs, bullet lists.

        === PROVIDED LINKS (USE ONLY THESE WHERE RELEVANT) ===

        Browser cookie controls:
        - Chrome: {browser_help_links["Chrome"]}
        - Firefox: {browser_help_links["Firefox"]}
        - Safari (macOS): {browser_help_links["Safari (macOS)"]}
        - Edge: {browser_help_links["Edge"]}
        - iPhone/iPad (iOS Safari): {browser_help_links["iPhone/iPad (iOS Safari)"]}
        - Android (Chrome): {browser_help_links["Android (Chrome)"]}

        Third-party opt-out links (only if the named service appears in our third_party_services list):
        {chr(10).join([f"- {name}: {link}" for name, link in recognised_services_with_links])}

        Third-party services without provided opt-out links (do NOT add URLs):
        {(", ".join(unrecognised_services) if unrecognised_services else "None")}

        - IMPORTANT: Do NOT use markdown link formatting like [text](url).
        - Output URLs as plain text only (e.g., https://example.com).

        - Do not mention an "app" or "APP privacy policy" unless explicitly stated.
        - If referencing privacy handling, say: "Our Privacy Policy explains how we handle personal information."

        - The policy must end after Section 8 (Contact Us). Do not append extra paragraphs after Contact Us.
    """.strip()

    # -----------------------------
    # 6) Build final prompt + invoke
    # -----------------------------
    prompt = COOKIE_POLICY_PROMPT.format(
        legal_context=legal_context,
        example_context=example_context,
        company_name=company_name,
        business_description=business_description,
        industry=industry,
        website=website,
        contact_email=contact_email,
        phone_number=phone_number,
        essential_cookies=essential_cookies,
        analytics_cookies=analytics_cookies,
        marketing_cookies=marketing_cookies,
        advertising_cookies=advertising_cookies,
        functional_cookies=functional_cookies,
        third_party_services=", ".join(services) if services else "None",
        cookie_duration=cookie_duration,
        additional_instructions=additional_instructions,
    )

    # Replace the placeholder in the prompt template line:
    # Include "Last Updated: [Current Date]" at the top.
    prompt = prompt.replace("Last Updated: [Current Date]", f"Last Updated: {today}")

    result = chain.invoke({"input": prompt})
    return result.model_dump()


result = generate_cookie_policy(
    # Company info
    company_name="CompliGen Pty Ltd",
    business_description="A SaaS platform that helps Australian SMEs generate compliance documents.",
    industry="SaaS",
    website="https://www.compligen.com.au",
    contact_email="support@compligen.com.au",
    phone_number="+61 2 9000 0000",

    # Cookie flags
    essential_cookies=True,
    analytics_cookies=True,
    marketing_cookies=False,
    advertising_cookies=False,
    functional_cookies=False,

    # Third-party services actually used
    third_party_services=[
        "Google Analytics"
    ],

    # Cookie duration
    cookie_duration=(
        "Session cookies are deleted when you close your browser. "
        "Analytics cookies may persist for up to 2 years unless deleted earlier."
    )
)

# LangChain returns an AIMessage
print(result)
