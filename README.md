# CompliGen – AI-Powered Compliance Document Generator

CompliGen is a full-stack web application that enables Australian businesses to generate legally structured compliance documents using AI-assisted generation. The platform leverages Retrieval-Augmented Generation (RAG) to create compliant legal policies based on Australian law, including the Privacy Act 1988 and Australian Consumer Law.

![CompliGen Banner](https://img.shields.io/badge/CompliGen-AI%20Compliance-blue)
![Django](https://img.shields.io/badge/Django-5.1.7-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Policy Types](#policy-types)
- [RAG System](#rag-system)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Core Functionality

- **AI-Powered Policy Generation**: Generate 5 types of compliance documents using Google Gemini 2.0 Flash
- **Retrieval-Augmented Generation (RAG)**: Context-aware generation using legal documents and real-world examples
- **Australian Legal Compliance**: Built-in compliance with ACL, Privacy Act 1988, and all 13 Australian Privacy Principles (APPs)
- **User Management**: Complete authentication system with email verification and JWT tokens
- **Policy Management Dashboard**: View, download, and manage all generated policies
- **PDF Export**: Download policies as formatted PDF documents
- **Industry-Specific Customization**: Tailored policies based on company industry and business model

### Security Features

- Email-based authentication with verification
- JWT token authentication with refresh mechanism
- Password reset flow with tokenized links
- 24-hour verification window
- Secure CORS configuration

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.2.4 | Build tool with HMR |
| Material-UI | 7.3.6 | Component library |
| React Router | 7.10.1 | Client-side routing |
| @react-pdf/renderer | 4.3.2 | PDF generation |
| jwt-decode | 4.0.0 | JWT token handling |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.x | Programming language |
| Django | 5.1.7 | Web framework |
| Django REST Framework | - | API framework |
| PostgreSQL | - | Primary database |
| SimpleJWT | - | JWT authentication |

### AI / LLM Stack

| Technology | Purpose |
|------------|---------|
| LangChain | LLM orchestration |
| ChromaDB | Vector database for embeddings |
| Google Generative AI | Text embeddings (text-embedding-004) |
| Google Gemini | Policy generation (gemini-2.0-flash-exp) |
| RAG | Retrieval-Augmented Generation |

---

## Architecture

CompliGen follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  Django Backend  │◄───────►│   PostgreSQL    │
│   (Port 5173)   │  REST   │   (Port 8000)    │         │    Database     │
│                 │  API    │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     │
                            ┌────────▼─────────┐
                            │                  │
                            │  RAG System      │
                            │  ┌────────────┐  │
                            │  │  ChromaDB  │  │
                            │  │  (Vectors) │  │
                            │  └────────────┘  │
                            │        │         │
                            │        ▼         │
                            │  ┌────────────┐  │
                            │  │  Gemini AI │  │
                            │  └────────────┘  │
                            └──────────────────┘
```

### RAG Workflow

1. **User Input**: Company information and policy requirements
2. **Document Retrieval**: Semantic search in ChromaDB for relevant legal docs and examples
3. **Context Augmentation**: Combine user input with retrieved legal context
4. **AI Generation**: Gemini generates structured policy using Pydantic schemas
5. **Validation**: Post-process to ensure compliance (ACL statements, no placeholders)
6. **Storage**: Save to PostgreSQL with structured sections
7. **Output**: Display formatted policy with PDF download option

---

## Project Structure

```
CompliGen/
├── CompliGen/                          # Django Backend
│   ├── authentication/                 # User authentication app
│   │   ├── models.py                   # Company, Customer models
│   │   ├── views.py                    # Auth views (register, login, verify)
│   │   └── urls.py                     # Auth endpoints
│   ├── policy_generator/               # Core policy generation app
│   │   ├── models.py                   # Policy models (ToS, Privacy, Cookie, DPA, AUP)
│   │   ├── views.py                    # Policy CRUD operations
│   │   ├── urls.py                     # Policy endpoints
│   │   └── rag/                        # RAG system
│   │       ├── ingestion.py            # Document ingestion pipeline
│   │       ├── terms_of_service.py     # ToS generator
│   │       ├── privacy_policy.py       # Privacy Policy generator
│   │       ├── cookie_policy.py        # Cookie Policy generator
│   │       ├── data_processing_agreement.py  # DPA generator
│   │       ├── acceptable_use_policy.py      # AUP generator
│   │       └── policy_outputs.py       # Pydantic schemas
│   ├── CompliGen/                      # Django project settings
│   │   ├── settings.py                 # Configuration
│   │   └── urls.py                     # Main URL routing
│   ├── PolicyGeneratorDocuments/       # Source documents for RAG
│   ├── chroma/                         # ChromaDB storage
│   ├── manage.py                       # Django management
│   └── .env                            # Environment variables
│
├── CompliGen_Frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/                 # React components
│   │   │   ├── Home.jsx                # Landing page
│   │   │   ├── Dashboard.jsx           # User dashboard
│   │   │   ├── PolicyGenerator.jsx     # Main generator interface
│   │   │   ├── Signup.jsx              # User registration
│   │   │   ├── Login.jsx               # Login page
│   │   │   ├── TosInput.jsx            # ToS input form
│   │   │   ├── TosOutput.jsx           # ToS display component
│   │   │   └── ...                     # Other policy components
│   │   ├── App.jsx                     # Main app with routing
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Global styles
│   ├── vite.config.js                  # Vite configuration
│   └── package.json                    # Dependencies
│
├── venv/                               # Python virtual environment
└── README.md                           # This file
```

---

## Getting Started

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18.x or higher
- **PostgreSQL**: 13 or higher
- **Google API Key**: For Gemini AI access
- **Gmail Account**: For email verification (app password required)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CompliGen
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   cd CompliGen
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create PostgreSQL database
   createdb compligen_db

   # Or using psql:
   psql -U postgres
   CREATE DATABASE compligen_db;
   ```

5. **Configure environment variables**

   Create a `.env` file in the `CompliGen/` directory:
   ```env
   DB_NAME=compligen_db
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   GMAIL=your_email@gmail.com
   GMAIL_PASSWORD=your_gmail_app_password
   GOOGLE_API_KEY=your_gemini_api_key
   ```

   **Note**:
   - For Gmail app password, enable 2FA and generate an app password at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Get Gemini API key from [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

6. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Ingest documents into ChromaDB (Optional)**

   If you have legal documents and examples in `PolicyGeneratorDocuments/`:
   ```python
   from policy_generator.rag.ingestion import ingest_documents
   ingest_documents()
   ```

8. **Start the Django development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd CompliGen_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

---

## Configuration

### Backend Configuration

**Django Settings** ([CompliGen/CompliGen/settings.py](CompliGen/CompliGen/settings.py)):

- **Database**: PostgreSQL configuration using environment variables
- **CORS**: Enabled for `http://localhost:5173`
- **Authentication**: JWT-based using `rest_framework_simplejwt`
- **Email**: Gmail SMTP backend for verification emails

**Key Settings**:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### Frontend Configuration

**Vite Config** ([CompliGen_Frontend/vite.config.js](CompliGen_Frontend/vite.config.js)):

- React plugin with Babel compilation
- React Compiler enabled for optimizations
- Development server on port 5173

---

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login with email/password |
| POST | `/user/verify` | Verify email with token |
| POST | `/failed/verify` | Resend verification email |
| POST | `/token/refresh/` | Refresh JWT access token |
| POST | `/user/reset/` | Request password reset |
| POST | `/user/password/new/` | Set new password |
| GET | `/credentials` | Get user profile |

### Policy Generation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents/generate/api/tos` | Generate Terms of Service |
| GET | `/documents/generate/api/tos` | List all ToS policies |
| DELETE | `/documents/generate/api/tos/<id>` | Delete ToS policy |
| POST | `/documents/generate/api/privacypolicy` | Generate Privacy Policy |
| GET | `/documents/generate/api/privacypolicy` | List all Privacy Policies |
| DELETE | `/documents/generate/api/privacypolicy/<id>` | Delete Privacy Policy |
| POST | `/documents/generate/api/cookie` | Generate Cookie Policy |
| GET | `/documents/generate/api/cookie` | List all Cookie Policies |
| DELETE | `/documents/generate/api/cookie/<id>` | Delete Cookie Policy |
| POST | `/documents/generate/api/dpa` | Generate DPA |
| GET | `/documents/generate/api/dpa` | List all DPAs |
| DELETE | `/documents/generate/api/dpa/<id>` | Delete DPA |
| POST | `/documents/generate/api/aup` | Generate AUP |
| GET | `/documents/generate/api/aup` | List all AUPs |
| DELETE | `/documents/generate/api/aup/<id>` | Delete AUP |
| GET | `/documents/generate/api/dashboard` | Dashboard statistics |

### Example Request

**Register User**:
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "company_name": "Acme Corp",
    "industry": "SaaS"
  }'
```

**Generate Privacy Policy**:
```bash
curl -X POST http://localhost:8000/documents/generate/api/privacypolicy \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "industry": "SaaS",
    "business_model": "B2B Software",
    "personal_information_collected": ["email", "name", "usage data"],
    ...
  }'
```

---

## Policy Types

CompliGen generates 5 types of compliance documents, each tailored for Australian businesses:

### 1. Terms of Service (ToS)
- **Length**: 2000-3000 words
- **Features**:
  - Australian Consumer Law (ACL) compliance
  - Service description and pricing
  - Intellectual property rights
  - Liability limitations
  - Termination clauses
  - Dispute resolution

### 2. Privacy Policy
- **Length**: 2000-3000 words
- **Features**:
  - Addresses all 13 Australian Privacy Principles (APPs)
  - Personal information collection and usage
  - Third-party disclosures
  - Data security measures
  - User rights (access, correction, deletion)
  - OAIC complaints process

### 3. Cookie Policy
- **Length**: 800-1500 words
- **Features**:
  - Types of cookies used
  - Purpose and duration
  - Third-party services
  - Browser opt-out instructions
  - Privacy Act compliance

### 4. Data Processing Agreement (DPA)
- **Features**:
  - GDPR-style data processing terms
  - Data controller/processor definitions
  - Security measures
  - Sub-processor management
  - Annexes (processing details, security measures)

### 5. Acceptable Use Policy (AUP)
- **Features**:
  - Permitted usage
  - Prohibited activities
  - Monitoring and enforcement
  - Violation consequences
  - Reporting mechanisms

---

## RAG System

### Document Ingestion

The RAG system ingests legal documents and policy examples to provide context for AI generation.

**Process** ([CompliGen/policy_generator/rag/ingestion.py](CompliGen/policy_generator/rag/ingestion.py)):

1. **Load Documents**: PDFs from `PolicyGeneratorDocuments/`
2. **Chunk**: Split into 1000-character chunks with 200-character overlap
3. **Embed**: Generate embeddings using Google `text-embedding-004`
4. **Store**: Save in ChromaDB with metadata:
   - `doc_type`: "law", "example", "template"
   - `policy_type`: "terms_of_service", "privacy_policy", etc.
   - `regulation`: "ACL", "Privacy Act 1988", etc.
   - `jurisdiction`: "Australia"

### Policy Generation

Each policy type has a dedicated generator that:

1. **Builds Semantic Queries**: Based on user input
2. **Retrieves Context**:
   - Legal documents (k=10): Relevant laws and regulations
   - Example documents (k=8): Real-world policies from similar companies
3. **Augments Prompt**: Combines legal context + examples + user data
4. **Generates Policy**: Using Gemini with structured output (Pydantic schemas)
5. **Post-processes**: Validates compliance and removes placeholders

**Example from** [CompliGen/policy_generator/rag/terms_of_service.py](CompliGen/policy_generator/rag/terms_of_service.py):

```python
# Retrieve legal context
legal_docs = vectorstore.similarity_search(
    query="Australian Consumer Law terms of service requirements",
    filter={"doc_type": "law"},
    k=10
)

# Retrieve example context
example_docs = vectorstore.similarity_search(
    query=f"terms of service for {industry} company",
    filter={"doc_type": "example", "policy_type": "terms_of_service"},
    k=8
)

# Generate with Gemini
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-exp",
    temperature=0.3
).with_structured_output(StructuredTermsOfService)

result = llm.invoke(prompt)
```

### Structured Output

**Pydantic Schemas** ([CompliGen/policy_generator/rag/policy_outputs.py](CompliGen/policy_generator/rag/policy_outputs.py)):

```python
class StructuredTermsOfService(BaseModel):
    title: str
    introduction: str
    sections: List[ToSSection]
    last_updated: str

class ToSSection(BaseModel):
    section_number: int
    heading: str
    content: str
```

This ensures consistent JSON structure and type safety.

---

## Database Schema

### Core Models

#### Authentication App

**Company** ([CompliGen/authentication/models.py](CompliGen/authentication/models.py)):
- `name`: Company name
- `industry`: Business sector

**Customer**:
- `user`: OneToOne with Django User
- `role`: User role in company
- `company`: ForeignKey to Company
- `verified`: Email verification status

#### Policy Generator App

**TermsOfService** ([CompliGen/policy_generator/models.py](CompliGen/policy_generator/models.py)):
- Company information fields
- Service details (pricing, refunds)
- Legal clauses (IP, liability, termination)
- Related `ToSSection` model for structured sections

**PrivacyPolicy**:
- Personal information collected (ArrayField)
- Third-party disclosures
- User rights
- Related models: `PrivacyPolicySection`, `PrivacyPolicySubsection`, `PrivacyPolicyContactInfo`

**CookiePolicy**:
- Cookie types and purposes
- Related models: `CookiePolicySection`, `CookieThirdPartyService`, `CookieBrowserInstruction`

**DataProcessingAgreement**:
- Complex structure with definitions and annexes
- Related models: `DPASection`, `DPADefinitions`, `DPAAnnexA`, `DPAAnnexB`, `DPASubProcessor`

**AcceptableUsePolicy**:
- Usage rules and enforcement
- Related model: `AUPSection`

### Database Features

- **PostgreSQL ArrayField**: Efficient storage of lists
- **GIN Indexes**: Fast querying on array fields
- **Cascade Delete**: Related sections deleted with parent policy
- **Timestamps**: Created and updated timestamps on all models

---

## Development

### Code Style

**Backend**:
- Follow PEP 8 guidelines
- Use Django best practices

**Frontend**:
- ESLint configuration in [CompliGen_Frontend/eslint.config.js](CompliGen_Frontend/eslint.config.js)
- React best practices

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Troubleshooting

### Common Issues

**1. Database Connection Error**
```
django.db.utils.OperationalError: could not connect to server
```
**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct.

**2. ChromaDB Not Found**
```
FileNotFoundError: chroma.sqlite3
```
**Solution**: Run document ingestion script to create ChromaDB:
```python
from policy_generator.rag.ingestion import ingest_documents
ingest_documents()
```

**3. CORS Error in Frontend**
```
Access to fetch at 'http://localhost:8000' blocked by CORS policy
```
**Solution**: Verify `CORS_ALLOWED_ORIGINS` in `settings.py` includes frontend URL.

**4. Email Verification Not Sending**
```
SMTPAuthenticationError
```
**Solution**:
- Enable 2FA on Gmail
- Generate app password at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Use app password in `.env` file

**5. Gemini API Rate Limit**
```
429 Resource has been exhausted
```
**Solution**: Implement rate limiting or upgrade API quota.

### Pydantic and Model Schema Issues

These are less common but critical bugs related to Pydantic schema validation and Django-LangChain integration:

**6. Pydantic ValidationError - Missing Required Fields**
```
pydantic.error_wrappers.ValidationError: 1 validation error for StructuredPrivacyPolicy
sections -> 0 -> subsections
  field required (type=value_error.missing)
```
**Cause**: LLM occasionally skips required fields in structured output, especially for deeply nested models.

**Solution**:
- Increase temperature slightly (0.3 → 0.4) to improve field completion
- Add explicit field requirements in the prompt: "MUST include all required fields"
- Implement retry logic with error feedback:
  ```python
  max_retries = 3
  for attempt in range(max_retries):
      try:
          result = llm.invoke(prompt)
          break
      except ValidationError as e:
          prompt += f"\n\nPREVIOUS ERROR: {e}. Please include all required fields."
  ```

**7. Pydantic Field Type Mismatch**
```
pydantic.error_wrappers.ValidationError: value is not a valid list (type=type_error.list)
```
**Cause**: LLM returns a string instead of a list for array fields (e.g., `personal_information_collected`).

**Solution**:
- Update Pydantic schema with field validators:
  ```python
  from pydantic import field_validator

  @field_validator('personal_information_collected', mode='before')
  def parse_list(cls, v):
      if isinstance(v, str):
          return [item.strip() for item in v.split(',')]
      return v
  ```
- Be explicit in prompts: "Return as JSON array, not comma-separated string"

**8. Django Model vs Pydantic Schema Mismatch**
```
django.db.utils.DataError: value too long for type character varying(255)
```
**Cause**: Pydantic schema allows unlimited string length, but Django model has `max_length` constraint.

**Solution**:
- Sync Pydantic `Field(max_length=255)` with Django model constraints
- Add length validation in Pydantic schemas:
  ```python
  from pydantic import Field

  company_name: str = Field(..., max_length=255)
  ```
- Truncate before saving to Django:
  ```python
  company_name = result.company_name[:255]
  ```

**9. ArrayField Serialization Error**
```
TypeError: Object of type 'dict' is not JSON serializable
```
**Cause**: Nested Pydantic models saved directly to Django ArrayField without serialization.

**Solution**:
- Convert Pydantic models to dicts before saving:
  ```python
  sections_data = [section.model_dump() for section in result.sections]
  # Or use .dict() for older Pydantic versions
  ```

**10. Structured Output Not Matching Schema**
```
langchain_core.exceptions.OutputParserException: Failed to parse output
```
**Cause**: Gemini's `with_structured_output()` sometimes returns malformed JSON or adds extra text.

**Solution**:
- Use `method="json_mode"` parameter:
  ```python
  llm.with_structured_output(StructuredTermsOfService, method="json_mode")
  ```
- Add JSON validation in prompt:
  ```
  "Return ONLY valid JSON matching the schema. No markdown, no explanations."
  ```
- Implement fallback parsing:
  ```python
  try:
      result = llm.invoke(prompt)
  except OutputParserException:
      # Extract JSON from response manually
      json_str = extract_json_from_text(response.content)
      result = StructuredTermsOfService.model_validate_json(json_str)
  ```

**11. Null/None Handling Inconsistency**
```
TypeError: 'NoneType' object is not iterable
```
**Cause**: Optional fields in Pydantic schema are `None`, but Django expects empty list `[]` for ArrayField.

**Solution**:
- Set default values in Pydantic:
  ```python
  third_party_services: List[str] = Field(default_factory=list)
  ```
- Or handle in Django model save:
  ```python
  def save(self, *args, **kwargs):
      self.third_party_services = self.third_party_services or []
      super().save(*args, **kwargs)
  ```

**12. Timezone Awareness Mismatch**
```
RuntimeError: DatetimeField received a naive datetime (without timezone)
```
**Cause**: Pydantic `datetime` objects are timezone-naive, but Django expects timezone-aware.

**Solution**:
- Use timezone-aware datetime in RAG generators:
  ```python
  from datetime import datetime
  import pytz

  sydney_tz = pytz.timezone('Australia/Sydney')
  last_updated = datetime.now(sydney_tz).strftime("%d %B %Y")
  ```

**13. Circular Import Between Django Models and Pydantic Schemas**
```
ImportError: cannot import name 'StructuredPrivacyPolicy' from partially initialized module
```
**Cause**: Django models import Pydantic schemas while Pydantic schemas reference Django models.

**Solution**:
- Keep Pydantic schemas completely separate from Django models
- Use `TYPE_CHECKING` for type hints:
  ```python
  from typing import TYPE_CHECKING

  if TYPE_CHECKING:
      from policy_generator.models import PrivacyPolicy
  ```

**14. Database Transaction Rollback After Pydantic Error**
```
django.db.transaction.TransactionManagementError: An error occurred in the current transaction
```
**Cause**: Pydantic validation fails mid-transaction, leaving database in dirty state.

**Solution**:
- Validate Pydantic output BEFORE database transaction:
  ```python
  # Generate and validate
  result = llm.invoke(prompt)  # Pydantic validates here

  # Then save to database
  with transaction.atomic():
      policy = PrivacyPolicy.objects.create(...)
  ```

---

## Future Enhancements

- [ ] Multi-language support
- [ ] Real-time collaborative editing
- [ ] Version control for policies
- [ ] Automated compliance checking
- [ ] Integration with legal review services
- [ ] Customizable templates
- [ ] Webhooks for policy updates
- [ ] Role-based access control (RBAC)
- [ ] Audit logs
- [ ] API rate limiting

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- **LangChain**: For LLM orchestration framework
- **Google**: For Gemini AI and embedding models
- **Django**: For robust backend framework
- **React**: For modern frontend development
- **Chroma**: For efficient vector storage

---

## Contact

For questions or support, please contact:
- **Email**: 24varun09@gmail.com
- **GitHub Issues**: [CompliGen Issues](https://github.com/s4733163/CompliGen/issues)

---

## Disclaimer

CompliGen provides AI-generated legal documents as a starting point. **Always consult with a qualified legal professional** before using any generated policies in a production environment. The generated documents are not a substitute for professional legal advice.

---

**Built with ❤️ for Australian businesses**
