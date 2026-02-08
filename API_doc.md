# CompliGen API Documentation

> Complete REST API reference for the CompliGen compliance document generation platform.

**Base URL**: `http://localhost:8000`

**Authentication**: JWT Bearer Token (except for public endpoints)

---

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Verify Email](#verify-email)
  - [Resend Verification](#resend-verification)
  - [Refresh Token](#refresh-token)
  - [Request Password Reset](#request-password-reset)
  - [Reset Password](#reset-password)
  - [Get User Profile](#get-user-profile)
- [Policy Generation](#policy-generation)
  - [Privacy Policy](#privacy-policy)
  - [Terms of Service](#terms-of-service)
  - [Cookie Policy](#cookie-policy)
  - [Data Processing Agreement](#data-processing-agreement)
  - [Acceptable Use Policy](#acceptable-use-policy)
- [Dashboard](#dashboard)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

All authentication endpoints are prefixed with `/api/`.

### Register

Create a new user account with company information.

**Endpoint**: `POST /api/register`

**Authentication**: None (public)

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "company_name": "Acme Corporation",
  "industry_type": "SaaS",
  "role": "CEO"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Unique username (max 255 chars) |
| `email` | string | Yes | Valid email address (used for login) |
| `password` | string | Yes | Account password (max 255 chars) |
| `company_name` | string | Yes | Company name (max 255 chars) |
| `industry_type` | string | Yes | Business sector (e.g., "SaaS", "E-commerce", "Healthcare") |
| `role` | string | Yes | User's role in company (e.g., "CEO", "Developer", "Legal") |

**Success Response** (201 Created):
```json
{
  "message": "Account created! Check your email and verify within 24 hours."
}
```

**Error Response** (400 Bad Request):
```json
{
  "message": "A user account already exists with the provided credentials."
}
```

**Notes**:
- A verification email is sent automatically upon registration
- Users must verify their email within 24 hours to login
- Email is case-insensitive and normalized before storage

---

### Login

Authenticate user and receive JWT tokens.

**Endpoint**: `POST /api/login`

**Authentication**: None (public)

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

**Success Response** (200 OK):
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "email": "john@example.com"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `refresh` | string | JWT refresh token (use to get new access tokens) |
| `access` | string | JWT access token (use in Authorization header) |
| `email` | string | Normalized email address |

**Error Responses**:

| Status | Message | Cause |
|--------|---------|-------|
| 400 | "User not found" | Email doesn't exist or wrong password |
| 400 | "Customer not found" | User exists but customer record missing |
| 400 | "Email not verified..." | User registered > 24 hours ago and not verified |

**Notes**:
- Access token expires after a configured period (default: 5 minutes)
- Refresh token expires after a longer period (default: 24 hours)
- Email verification is required after 24 hours from registration

---

### Verify Email

Verify user's email using token from verification link.

**Endpoint**: `POST /api/user/verify`

**Authentication**: None (public)

**Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Signed verification token from email link |

**Success Response** (200 OK):
```json
{
  "message": "The user has been verified successfully"
}
```

**Error Responses**:

| Status | Response | Cause |
|--------|----------|-------|
| 400 | `{"status": "expired"}` | Token older than 24 hours |
| 400 | `{"status": "invalid"}` | Token tampered with or malformed |
| 400 | `{"message": "User does not exist"}` | User ID in token not found |
| 200 | `{"message": "User already verified"}` | Already verified (idempotent) |

---

### Resend Verification

Request a new verification email for unverified accounts.

**Endpoint**: `POST /failed/verify`

**Authentication**: None (public)

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response** (201 Created):
```json
{
  "message": "Email sent successfully."
}
```

**Error Responses**:

| Status | Message | Cause |
|--------|---------|-------|
| 400 | "User not found" | Email not registered |
| 400 | "Customer not found" | User exists but customer record missing |
| 400 | "User already verified" | Email already verified |

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint**: `POST /api/token/refresh/`

**Authentication**: None (public)

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Error Response** (401 Unauthorized):
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

---

### Request Password Reset

Initiate password reset flow by sending reset email.

**Endpoint**: `POST /api/user/reset/`

**Authentication**: None (public)

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response** (200 OK):
```json
{
  "message": "The email has been sent",
  "uid": "MQ",
  "token": "c5k2vh-a8f7d9e6b3c1..."
}
```

**Error Responses**:

| Status | Message | Cause |
|--------|---------|-------|
| 400 | "Email is required." | Missing email field |
| 404 | "The user does not exist" | Email not registered |

**Notes**:
- Reset link format: `http://localhost:5173/reset-password/{uid}/{token}`
- Token is tied to current password hash (invalidated after password change)

---

### Reset Password

Complete password reset with new password.

**Endpoint**: `POST /api/user/password/new/`

**Authentication**: None (public)

**Request Body**:
```json
{
  "uid": "MQ",
  "token": "c5k2vh-a8f7d9e6b3c1...",
  "new_password": "NewSecurePassword456!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | Yes | URL-safe base64 encoded user ID from reset link |
| `token` | string | Yes | Password reset token from reset link |
| `new_password` | string | Yes | New password to set |

**Success Response** (200 OK):
```json
{
  "message": "Password has been reset successfully."
}
```

**Error Responses**:

| Status | Message | Cause |
|--------|---------|-------|
| 400 | "Missing data" | Required fields missing |
| 400 | "Invalid link" | UID decode failed or user not found |
| 400 | "Invalid or expired token" | Token expired or already used |

---

### Get User Profile

Retrieve authenticated user's profile information.

**Endpoint**: `GET /api/credentials`

**Authentication**: Required (Bearer Token)

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Policy Generation

All policy endpoints are prefixed with `/documents/generate/api/` and require JWT authentication.

**Common Headers for All Policy Endpoints**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

### Privacy Policy

Generate, retrieve, and delete Privacy Policies compliant with Australian Privacy Act 1988.

#### Generate Privacy Policy

**Endpoint**: `POST /documents/generate/api/privacypolicy`

**Request Body**:
```json
{
  "company_name": "Acme Corporation",
  "website_url": "https://acme.com.au",
  "industry": "SaaS",
  "business_model": "B2B Software",
  "personal_information_collected": [
    "email",
    "name",
    "phone number",
    "usage data",
    "payment information"
  ],
  "purpose_of_collection": [
    "service delivery",
    "billing",
    "customer support",
    "marketing"
  ],
  "third_party_disclosures": [
    "payment processors",
    "analytics providers",
    "cloud hosting"
  ],
  "data_retention_period": "7 years",
  "overseas_disclosures": true,
  "overseas_countries": ["United States", "Singapore"]
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Privacy Policy",
  "company_name": "Acme Corporation",
  "last_updated": "08 February 2026",
  "introduction": "Acme Corporation (ABN: ...) is committed to protecting...",
  "sections": [
    {
      "section_number": 1,
      "heading": "Information We Collect",
      "content": "We collect personal information...",
      "subsections": [
        {
          "subsection_number": 1,
          "heading": "Personal Information",
          "content": "..."
        }
      ]
    }
  ],
  "contact_info": {
    "privacy_officer": "Privacy Officer",
    "email": "privacy@acme.com.au",
    "address": "123 Business St, Sydney NSW 2000",
    "phone": "+61 2 1234 5678"
  }
}
```

#### Get All Privacy Policies

**Endpoint**: `GET /documents/generate/api/privacypolicy`

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Privacy Policy",
    "company_name": "Acme Corporation",
    "created_at": "2026-02-08T10:30:00Z",
    "last_updated": "08 February 2026",
    "sections": [...]
  }
]
```

#### Delete Privacy Policy

**Endpoint**: `DELETE /documents/generate/api/privacypolicy/<id>`

**URL Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Policy ID to delete |

**Success Response** (204 No Content): Empty body

**Error Response** (404 Not Found):
```json
{
  "error": "Not found"
}
```

---

### Terms of Service

Generate, retrieve, and delete Terms of Service compliant with Australian Consumer Law.

#### Generate Terms of Service

**Endpoint**: `POST /documents/generate/api/tos`

**Request Body**:
```json
{
  "company_name": "Acme Corporation",
  "website_url": "https://acme.com.au",
  "industry": "SaaS",
  "service_description": "Cloud-based project management software",
  "pricing_model": "subscription",
  "free_trial": true,
  "free_trial_duration": "14 days",
  "refund_policy": "30-day money-back guarantee",
  "user_content_allowed": true,
  "age_restriction": 18,
  "jurisdiction": "New South Wales, Australia"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Terms of Service",
  "company_name": "Acme Corporation",
  "last_updated": "08 February 2026",
  "introduction": "Welcome to Acme Corporation...",
  "sections": [
    {
      "section_number": 1,
      "heading": "Acceptance of Terms",
      "content": "By accessing or using our services..."
    },
    {
      "section_number": 2,
      "heading": "Australian Consumer Law",
      "content": "Nothing in these Terms excludes, restricts or modifies any consumer guarantee..."
    }
  ]
}
```

#### Get All Terms of Service

**Endpoint**: `GET /documents/generate/api/tos`

#### Delete Terms of Service

**Endpoint**: `DELETE /documents/generate/api/tos/<id>`

---

### Cookie Policy

Generate, retrieve, and delete Cookie Policies.

#### Generate Cookie Policy

**Endpoint**: `POST /documents/generate/api/cookie`

**Request Body**:
```json
{
  "company_name": "Acme Corporation",
  "website_url": "https://acme.com.au",
  "cookie_types": [
    "essential",
    "analytics",
    "marketing",
    "preferences"
  ],
  "third_party_services": [
    "Google Analytics",
    "Facebook Pixel",
    "Intercom"
  ],
  "consent_mechanism": "cookie banner"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Cookie Policy",
  "company_name": "Acme Corporation",
  "last_updated": "08 February 2026",
  "introduction": "This Cookie Policy explains how Acme Corporation uses cookies...",
  "sections": [...],
  "third_party_services": [
    {
      "name": "Google Analytics",
      "purpose": "Website analytics and traffic measurement",
      "cookie_names": ["_ga", "_gid", "_gat"],
      "duration": "2 years",
      "link": "https://policies.google.com/privacy"
    }
  ],
  "browser_instructions": [
    {
      "browser": "Google Chrome",
      "instructions": "Go to Settings > Privacy and security > Cookies..."
    }
  ]
}
```

#### Get All Cookie Policies

**Endpoint**: `GET /documents/generate/api/cookie`

#### Delete Cookie Policy

**Endpoint**: `DELETE /documents/generate/api/cookie/<id>`

---

### Data Processing Agreement

Generate, retrieve, and delete GDPR-style Data Processing Agreements.

#### Generate DPA

**Endpoint**: `POST /documents/generate/api/dpa`

**Request Body**:
```json
{
  "controller_name": "Acme Corporation",
  "controller_address": "123 Business St, Sydney NSW 2000",
  "processor_name": "CloudTech Services",
  "processor_address": "456 Tech Ave, Melbourne VIC 3000",
  "processing_purposes": [
    "data storage",
    "analytics processing",
    "backup services"
  ],
  "data_subjects": [
    "customers",
    "employees",
    "website visitors"
  ],
  "personal_data_types": [
    "contact information",
    "usage data",
    "financial data"
  ],
  "sub_processors": [
    {
      "name": "AWS",
      "location": "United States",
      "purpose": "Cloud hosting"
    }
  ],
  "data_transfer_countries": ["United States", "Ireland"]
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Data Processing Agreement",
  "effective_date": "08 February 2026",
  "controller_name": "Acme Corporation",
  "processor_name": "CloudTech Services",
  "definitions": [
    {
      "term": "Personal Data",
      "definition": "Any information relating to an identified or identifiable natural person..."
    }
  ],
  "sections": [...],
  "annex_a": {
    "processing_details": "...",
    "data_subjects": [...],
    "data_categories": [...]
  },
  "annex_b": {
    "technical_measures": [...],
    "organizational_measures": [...]
  },
  "sub_processors": [...]
}
```

#### Get All DPAs

**Endpoint**: `GET /documents/generate/api/dpa`

#### Delete DPA

**Endpoint**: `DELETE /documents/generate/api/dpa/<id>`

---

### Acceptable Use Policy

Generate, retrieve, and delete Acceptable Use Policies.

#### Generate AUP

**Endpoint**: `POST /documents/generate/api/aup`

**Request Body**:
```json
{
  "company_name": "Acme Corporation",
  "service_name": "Acme Cloud Platform",
  "service_type": "cloud software",
  "prohibited_activities": [
    "illegal content",
    "spam",
    "malware distribution",
    "unauthorized access"
  ],
  "content_restrictions": true,
  "resource_limits": true,
  "monitoring_disclosure": true,
  "enforcement_actions": [
    "warning",
    "suspension",
    "termination"
  ]
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "title": "Acceptable Use Policy",
  "company_name": "Acme Corporation",
  "service_name": "Acme Cloud Platform",
  "last_updated": "08 February 2026",
  "introduction": "This Acceptable Use Policy governs your use of...",
  "sections": [
    {
      "section_number": 1,
      "heading": "Permitted Use",
      "content": "..."
    },
    {
      "section_number": 2,
      "heading": "Prohibited Activities",
      "content": "..."
    }
  ]
}
```

#### Get All AUPs

**Endpoint**: `GET /documents/generate/api/aup`

#### Delete AUP

**Endpoint**: `DELETE /documents/generate/api/aup/<id>`

---

## Dashboard

Get aggregated statistics and latest policies for the authenticated user.

**Endpoint**: `GET /documents/generate/api/dashboard`

**Authentication**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "total_policies": 15,
  "counts": {
    "privacy_policy": 3,
    "terms_of_service": 4,
    "data_processing_agreement": 2,
    "acceptable_use_policy": 3,
    "cookie_policy": 3
  },
  "latest": {
    "privacy_policy": {
      "id": 5,
      "title": "Privacy Policy",
      "company_name": "Acme Corporation",
      "created_at": "2026-02-08T10:30:00Z",
      "sections": [...]
    },
    "terms_of_service": {
      "id": 8,
      "title": "Terms of Service",
      ...
    },
    "data_processing_agreement": null,
    "acceptable_use_policy": {...},
    "cookie_policy": {...}
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `total_policies` | integer | Sum of all policy types |
| `counts` | object | Count per policy type |
| `latest` | object | Most recent policy of each type (null if none) |

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message describing the issue"
}
```

Or for validation errors:

```json
{
  "message": "Detailed validation error message"
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 404 | Not Found - Resource doesn't exist or not owned by user |
| 500 | Internal Server Error - Policy generation or server error |

### Policy Generation Errors

When policy generation fails, the API returns a generic error to avoid exposing internal details:

```json
{
  "error": "Policy failed to generate. Please retry"
}
```

This may occur due to:
- LLM API rate limits or timeouts
- Pydantic schema validation failures
- Database integrity errors
- Network connectivity issues

**Recommendation**: Implement client-side retry logic with exponential backoff.

---

## Rate Limiting

Currently, the API does not implement rate limiting at the application level. However, the following external limits may apply:

| Service | Limit | Notes |
|---------|-------|-------|
| Google Gemini API | Varies by plan | Free tier: 15 RPM, 1M TPD |
| OpenAI Embeddings | Varies by plan | Check your OpenAI usage limits |
| SMTP (Gmail) | 500/day | Gmail sending limits |

**Recommendation**: For production deployments, implement rate limiting using Django REST Framework throttling or a reverse proxy like nginx.

---

## Authentication Flow Diagram

```
┌─────────────┐     POST /api/register     ┌─────────────┐
│   Client    │ ─────────────────────────► │   Server    │
│             │                            │             │
│             │ ◄───────────────────────── │  (201 OK)   │
│             │   "Check email to verify"  │             │
└─────────────┘                            └─────────────┘
       │                                          │
       │                                          ▼
       │                                   ┌─────────────┐
       │                                   │ Send Email  │
       │                                   │ with Token  │
       │                                   └─────────────┘
       │
       │  (User clicks verification link)
       ▼
┌─────────────┐     POST /api/user/verify  ┌─────────────┐
│   Client    │ ─────────────────────────► │   Server    │
│             │   { token: "..." }         │             │
│             │ ◄───────────────────────── │  (200 OK)   │
│             │   "Verified successfully"  │             │
└─────────────┘                            └─────────────┘
       │
       │
       ▼
┌─────────────┐     POST /api/login        ┌─────────────┐
│   Client    │ ─────────────────────────► │   Server    │
│             │   { email, password }      │             │
│             │ ◄───────────────────────── │  (200 OK)   │
│             │   { access, refresh }      │             │
└─────────────┘                            └─────────────┘
       │
       │  (Use access token for authenticated requests)
       ▼
┌─────────────┐     GET /api/credentials   ┌─────────────┐
│   Client    │ ─────────────────────────► │   Server    │
│             │   Authorization: Bearer... │             │
│             │ ◄───────────────────────── │  (200 OK)   │
│             │   { username, email }      │             │
└─────────────┘                            └─────────────┘
```

---

## Policy Generation Flow Diagram

```
┌─────────────┐                            ┌─────────────┐
│   Client    │  POST .../privacypolicy    │   Server    │
│             │ ─────────────────────────► │             │
│             │   { company_name, ... }    │             │
│             │   Authorization: Bearer... │             │
└─────────────┘                            └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  Get User/  │
                                           │  Customer   │
                                           └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │ RAG Pipeline│
                                           │ 1. Retrieve │◄──┐
                                           │    legal    │   │
                                           │    docs     │   │ ChromaDB
                                           │ 2. Retrieve │   │ Vector
                                           │    examples │───┘ Search
                                           └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │   Gemini    │
                                           │  Generate   │
                                           │  Policy     │
                                           └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  Pydantic   │
                                           │  Validate   │
                                           └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │   Save to   │
                                           │ PostgreSQL  │
                                           └──────┬──────┘
                                                  │
┌─────────────┐                                   │
│   Client    │ ◄─────────────────────────────────┘
│             │   { id, title, sections, ... }
└─────────────┘   (200 OK)
```

---

## Code Examples

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:8000"

# Register
response = requests.post(f"{BASE_URL}/api/register", json={
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "company_name": "Acme Corp",
    "industry_type": "SaaS",
    "role": "Developer"
})
print(response.json())

# Login
response = requests.post(f"{BASE_URL}/api/login", json={
    "email": "john@example.com",
    "password": "SecurePass123!"
})
tokens = response.json()
access_token = tokens["access"]

# Generate Privacy Policy
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.post(
    f"{BASE_URL}/documents/generate/api/privacypolicy",
    headers=headers,
    json={
        "company_name": "Acme Corp",
        "industry": "SaaS",
        "personal_information_collected": ["email", "name", "usage data"]
    }
)
policy = response.json()
print(f"Generated policy ID: {policy['id']}")
```

### JavaScript (fetch)

```javascript
const BASE_URL = "http://localhost:8000";

// Login
const loginResponse = await fetch(`${BASE_URL}/api/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "SecurePass123!"
  })
});
const { access } = await loginResponse.json();

// Generate Terms of Service
const tosResponse = await fetch(`${BASE_URL}/documents/generate/api/tos`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${access}`
  },
  body: JSON.stringify({
    company_name: "Acme Corp",
    service_description: "Cloud software platform",
    pricing_model: "subscription"
  })
});
const tos = await tosResponse.json();
console.log(`Generated ToS ID: ${tos.id}`);
```

### cURL

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123!"}'

# Generate Privacy Policy (replace <token> with actual access token)
curl -X POST http://localhost:8000/documents/generate/api/privacypolicy \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "industry": "SaaS",
    "personal_information_collected": ["email", "name"]
  }'

# Get Dashboard
curl -X GET http://localhost:8000/documents/generate/api/dashboard \
  -H "Authorization: Bearer <token>"

# Delete Policy
curl -X DELETE http://localhost:8000/documents/generate/api/privacypolicy/1 \
  -H "Authorization: Bearer <token>"
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-08 | Initial API documentation |

---

## Support

For API issues or questions:
- **Email**: 24varun09@gmail.com
- **GitHub Issues**: [CompliGen Issues](https://github.com/s4733163/CompliGen/issues)
