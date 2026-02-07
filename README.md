# CompliGen – AI-Powered Compliance Document Generator

> **Production-ready SaaS platform automating legal compliance document generation for Australian businesses using advanced RAG (Retrieval-Augmented Generation) technology.**

![CompliGen Banner](https://img.shields.io/badge/CompliGen-AI%20Compliance-blue) ![Django](https://img.shields.io/badge/Django-5.1.7-green) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

[Live Demo](#) • [Documentation](#api-documentation) • [Architecture](#architecture)

---

## 🎯 Project Highlights

- **Full-Stack Development**: End-to-end implementation of enterprise SaaS platform with React frontend and Django REST backend
- **AI/ML Integration**: Implemented production RAG pipeline using LangChain, ChromaDB vector database, and Google Gemini LLM
- **Legal Compliance Engine**: Automated generation of 5 policy types compliant with Australian Privacy Act 1988 and Consumer Law
- **Scalable Architecture**: PostgreSQL database with optimized vector search, JWT authentication, and RESTful API design
- **Production Features**: Email verification system, PDF generation, secure CORS configuration, and comprehensive error handling

### 📊 Technical Metrics
- **Backend**: 15+ REST API endpoints with full CRUD operations
- **Database**: 10+ Django models with complex relationships and ArrayFields
- **RAG Pipeline**: 3-stage document processing (ingestion → embedding → retrieval)
- **AI Integration**: Structured output generation using Pydantic schemas with 5 distinct policy generators
- **Frontend**: 12+ React components with Material-UI design system

---

## Overview

CompliGen is an enterprise-grade full-stack web application that automates the generation of legally compliant documents for Australian businesses. The platform leverages Retrieval-Augmented Generation (RAG) to produce context-aware policies grounded in Australian Privacy Act 1988, Australian Consumer Law (ACL), and real-world industry examples.

### 🚀 Key Features & Technical Achievements

- **AI-Powered Policy Generation**: Integrated Google Gemini 2.0 Flash with structured output using Pydantic schemas for type-safe, validated document generation
- **Advanced RAG Pipeline**: Built custom document ingestion pipeline with semantic chunking, OpenAI embeddings, and ChromaDB vector storage for context retrieval
- **Australian Legal Compliance**: Engineered validation system ensuring adherence to 13 Australian Privacy Principles (APPs) and ACL requirements
- **5 Policy Types**: Terms of Service, Privacy Policy, Cookie Policy, Data Processing Agreement, Acceptable Use Policy
- **Production-Grade Authentication**: Implemented JWT-based auth flow with email verification, token refresh, and password reset functionality
- **Industry-Specific Customization**: Context-aware generation adapting to company sector, business model, and regulatory requirements
- **RESTful API**: Comprehensive REST API with CRUD operations, filtering, and dashboard analytics
- **PDF Generation**: Dynamic PDF export using @react-pdf/renderer with formatted legal document layouts
- **Database Optimization**: PostgreSQL with ArrayField, GIN indexes, and efficient relationship modeling for complex nested policy structures

---

## 💼 Technical Skills Demonstrated

### Backend Development
- **Django & DRF**: RESTful API design, model relationships, custom authentication, middleware
- **Database Design**: PostgreSQL with advanced features (ArrayField, GIN indexes, cascade operations)
- **Authentication & Security**: JWT tokens, email verification, CORS configuration, secure password handling

### AI/ML Engineering
- **LLM Integration**: Google Gemini API integration with structured outputs and Pydantic validation
- **RAG Implementation**: Vector database design, semantic search, document chunking strategies
- **Prompt Engineering**: Context augmentation, structured generation, error handling and retry logic

### Frontend Development
- **React 19**: Modern hooks, component architecture, routing, state management
- **Material-UI**: Responsive design, form validation, user experience optimization
- **PDF Generation**: Dynamic document rendering with @react-pdf/renderer

### DevOps & Architecture
- **API Design**: RESTful principles, versioning, comprehensive endpoint documentation
- **Error Handling**: Validation layers, transaction management, graceful degradation
- **Testing & Debugging**: Pydantic schema validation, Django-LangChain integration troubleshooting

---

## Tech Stack

**Frontend**: React 19, Vite, Material-UI, React Router, @react-pdf/renderer  
**Backend**: Django 5.1.7, Django REST Framework, PostgreSQL, SimpleJWT  
**AI/LLM**: LangChain, ChromaDB, OpenAI Embeddings (text-embedding-3-small), Google Gemini (gemini-2.0-flash-exp)

### Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│ React Frontend  │◄─────►│ Django Backend   │◄─────►│  PostgreSQL     │
│   (Port 5173)   │  REST │   (Port 8000)    │       │   Database      │
└─────────────────┘  API  └──────────────────┘       └─────────────────┘
                                    │
                          ┌─────────▼──────────┐
                          │    RAG System      │
                          │  ┌──────────────┐  │
                          │  │  ChromaDB    │  │
                          │  │  (Vectors)   │  │
                          │  └──────────────┘  │
                          │         ▼          │
                          │  ┌──────────────┐  │
                          │  │  Gemini AI   │  │
                          │  └──────────────┘  │
                          └────────────────────┘
```

---

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 13+
- Google API Key (Gemini)
- OpenAI API Key
- Gmail account with app password

### Installation

1. **Clone and setup backend**

```bash
git clone <repository-url>
cd CompliGen

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
cd CompliGen
pip install -r requirements.txt

# Create PostgreSQL database
createdb compligen_db

# Configure environment variables
cat > .env << EOL
DB_NAME=compligen_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
GMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_gmail_app_password
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
EOL

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start backend
python manage.py runserver
```

2. **Setup frontend**

```bash
cd CompliGen_Frontend
npm install
npm run dev
```

**Access**: Frontend at `http://localhost:5173`, Backend at `http://localhost:8000`

### API Keys

- **Gmail App Password**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- **Gemini API**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **OpenAI API**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## Project Structure

```
CompliGen/
├── CompliGen/                      # Django Backend
│   ├── authentication/             # User auth (models, views, urls)
│   ├── policy_generator/           # Policy generation app
│   │   ├── models.py              # Policy models (ToS, Privacy, etc.)
│   │   ├── views.py               # API endpoints
│   │   └── rag/                   # RAG system
│   │       ├── ingestion.py       # Document ingestion
│   │       ├── terms_of_service.py
│   │       ├── privacy_policy.py
│   │       ├── cookie_policy.py
│   │       ├── data_processing_agreement.py
│   │       ├── acceptable_use_policy.py
│   │       └── policy_outputs.py  # Pydantic schemas
│   ├── PolicyGeneratorDocuments/  # Source docs for RAG
│   │   ├── Laws/                  # Australian regulations
│   │   ├── examples/              # Real-world policy examples
│   │   └── policy_template/       # Templates
│   ├── chroma/                    # ChromaDB vector storage
│   └── manage.py
│
└── CompliGen_Frontend/            # React Frontend
    ├── src/
    │   ├── components/            # React components
    │   │   ├── Dashboard.jsx
    │   │   ├── PolicyGenerator.jsx
    │   │   └── ...
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🧠 RAG System Architecture

### Technical Implementation

**Custom Document Ingestion Pipeline:**
- Automated PDF processing with metadata extraction and tagging
- Semantic chunking (1000 chars, 200 overlap) optimized for legal document structure
- OpenAI text-embedding-3-small for high-quality vector representations
- ChromaDB persistence layer with filtered similarity search

**Intelligent Retrieval Strategy:**
- Dual-context retrieval: Legal documents (k=10) + Industry examples (k=8)
- Metadata filtering by doc_type, policy_type, regulation, and jurisdiction
- Semantic query construction based on user input parameters

**Structured Generation:**
- Pydantic schema definitions for type-safe, validated outputs
- Gemini 2.0 Flash with temperature tuning (0.3) for consistent results
- Post-processing validation ensuring compliance and placeholder removal

### Document Organization

The RAG system uses documents from `PolicyGeneratorDocuments/` with specific naming conventions:

**Directory Structure:**
```
PolicyGeneratorDocuments/
├── Laws/                           # Australian legal documents
│   └── Privacy_Act_1988.pdf       # Format: {Regulation_Name}.pdf
├── examples/                       # Real-world examples
│   ├── privacy_policies/
│   │   └── Privacy Policy_Canva.pdf  # Format: {Policy Type}_{Company}.pdf
│   ├── terms_of_service/
│   └── cookie_policy/
└── policy_template/               # Templates
```

**Critical Naming Rules:**

1. **Examples**: `{Policy Type}_{Company Name}.pdf`
   - ✅ `Privacy Policy_Canva.pdf`
   - ✅ `Terms of use_Atlassian.pdf`
   - ❌ `Canva Privacy Policy.pdf` (wrong order)
   - ❌ `PrivacyPolicy_Canva.pdf` (no space)

2. **Policy Types** (case-sensitive):
   - `Privacy Policy`
   - `Terms of use`
   - `Cookies Policy`
   - `Data Processing Addendum`
   - `Acceptable Use Policy`

### Adding Documents

1. Place file in correct directory
2. Name according to convention
3. Run ingestion:
   ```python
   from policy_generator.rag.ingestion import ingest_documents
   ingest_documents()
   ```

### Generation Pipeline

1. **User Input** → Company info and requirements
2. **Retrieval** → Semantic search in ChromaDB (legal docs k=10, examples k=8)
3. **Augmentation** → Combine retrieved context with user data
4. **Generation** → Gemini generates structured policy via Pydantic schemas
5. **Validation** → Ensure compliance and remove placeholders
6. **Storage** → Save to PostgreSQL with structured sections

---

## API Documentation

### Base URL: `http://localhost:8000`

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | Register user |
| `/api/login` | POST | Login |
| `/api/user/verify` | POST | Verify email |
| `/api/token/refresh/` | POST | Refresh JWT |

### Policy Generation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents/generate/api/tos` | POST/GET/DELETE | Terms of Service |
| `/documents/generate/api/privacypolicy` | POST/GET/DELETE | Privacy Policy |
| `/documents/generate/api/cookie` | POST/GET/DELETE | Cookie Policy |
| `/documents/generate/api/dpa` | POST/GET/DELETE | Data Processing Agreement |
| `/documents/generate/api/aup` | POST/GET/DELETE | Acceptable Use Policy |
| `/documents/generate/api/dashboard` | GET | Dashboard stats |

**Example Request:**
```bash
curl -X POST http://localhost:8000/documents/generate/api/privacypolicy \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "industry": "SaaS",
    "business_model": "B2B Software",
    "personal_information_collected": ["email", "name", "usage data"]
  }'
```

---

## Policy Types

1. **Terms of Service** (2000-3000 words): ACL compliance, service description, IP rights, liability, termination
2. **Privacy Policy** (2000-3000 words): All 13 APPs, data collection/usage, user rights, OAIC process
3. **Cookie Policy** (800-1500 words): Cookie types, purposes, third-party services, opt-out instructions
4. **Data Processing Agreement**: GDPR-style terms, controller/processor definitions, security measures
5. **Acceptable Use Policy**: Permitted usage, prohibited activities, enforcement, reporting

---

## Troubleshooting

### Common Issues

**Database Connection Error**
```
django.db.utils.OperationalError: could not connect to server
```
→ Ensure PostgreSQL is running and `.env` credentials are correct

**ChromaDB Not Found**
```python
from policy_generator.rag.ingestion import ingest_documents
ingest_documents()
```

**Email Verification Not Sending**
→ Enable 2FA and generate Gmail app password

**Pydantic ValidationError**
→ LLM may skip required fields. Implement retry logic with error feedback:
```python
max_retries = 3
for attempt in range(max_retries):
    try:
        result = llm.invoke(prompt)
        break
    except ValidationError as e:
        prompt += f"\n\nERROR: {e}. Include all required fields."
```

---

## 🔧 Key Engineering Challenges Solved

### 1. Pydantic-Django Integration
**Challenge**: Type mismatches between LLM-generated Pydantic models and Django ORM models  
**Solution**: Implemented field validators, retry logic with error feedback, and proper serialization layers

### 2. RAG Context Optimization
**Challenge**: Balancing retrieval quality vs. token limits for LLM context windows  
**Solution**: Dual-retrieval strategy (legal + examples), semantic chunking, and metadata-based filtering

### 3. Structured Output Reliability
**Challenge**: LLM occasionally returns malformed JSON or skips required fields  
**Solution**: JSON mode enforcement, schema validation with retries, and fallback parsing mechanisms

### 4. Legal Compliance Validation
**Challenge**: Ensuring all generated policies meet Australian legal requirements  
**Solution**: Post-generation validation checks, ACL statement enforcement, and placeholder detection/removal

---

## Development

### Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- **Backend**: PEP 8, Django best practices
- **Frontend**: ESLint configuration, React best practices

---

## License

This project is licensed under the MIT License.

---

## 📬 Contact & Portfolio

**Developer**: Varun Singh 
**Email**: 24varun09@gmail.com  
**GitHub**: [View Profile](https://github.com/s4733163)  
**Project Repository**: [CompliGen](https://github.com/s4733163/CompliGen)

*Open to opportunities in Full-Stack Development, AI/ML Engineering, and SaaS Product Development*

---

## Disclaimer

CompliGen provides AI-generated legal documents as a starting point. **Always consult with a qualified legal professional** before using any generated policies in production. The generated documents are not a substitute for professional legal advice.

---

**Built with ❤️ for Australian businesses**