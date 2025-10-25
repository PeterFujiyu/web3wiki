# Glossary API Documentation

## Overview

The Glossary API allows users to submit new terms and edits to existing terms for the Web3 Glossary. Submissions are stored for review before being published to the main glossary.

## Authentication

**Admin endpoints** (marked with 🔒) require **localhost access only**. These endpoints will only accept requests from:
- `127.0.0.1`
- `localhost`
- `::1` (IPv6 localhost)
- `::ffff:127.0.0.1` (IPv4-mapped IPv6)

Requests from any other IP address will receive a `403 Forbidden` response.

## Endpoints

### 1. Submit Glossary Term

**POST** `/api/glossary`

Submit a new term or edit an existing term for review.

#### Request Body

```json
{
  "id": "blockchain",              // Optional, auto-generated from term name if not provided
  "term": "Blockchain",            // Required
  "definition": "A distributed...", // Required, supports Markdown
  "category": "Blockchain",        // Required
  "tags": ["technology", "crypto"], // Optional, array of strings
  "relatedTerms": ["bitcoin", "ethereum"], // Optional, array of term IDs
  "difficulty": "beginner",        // Optional: "beginner", "intermediate", or "advanced"
  "language": "en",                // Required: "en" or "zh"
  "mode": "create"                 // Required: "create" or "edit"
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Glossary term submitted successfully",
  "submissionId": "1234567890"
}
```

**Error (400)**
```json
{
  "success": false,
  "message": "Missing required fields (term, definition, category, language)"
}
```

---

### 2. Get All Submissions 🔒

**GET** `/api/glossary/submissions`

Retrieve all pending and processed submissions (for admin review).

**⚠️ Requires localhost access only**

#### Response

```json
{
  "success": true,
  "count": 5,
  "submissions": [
    {
      "submissionId": "1234567890",
      "termId": "blockchain",
      "term": "Blockchain",
      "definition": "A distributed ledger...",
      "category": "Blockchain",
      "tags": ["technology"],
      "relatedTerms": ["bitcoin"],
      "difficulty": "beginner",
      "language": "en",
      "mode": "create",
      "timestamp": "2025-01-15T10:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

### 3. Approve Submission 🔒

**POST** `/api/glossary/approve/:submissionId`

Approve a submission and publish it to the main glossary.json file.

**⚠️ Requires localhost access only**

#### Parameters

- `submissionId` (path parameter): The ID of the submission to approve

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Glossary term approved and published"
}
```

**Error (404)**
```json
{
  "success": false,
  "message": "Submission not found"
}
```

**Error (403) - Not from localhost**
```json
{
  "success": false,
  "message": "Access denied. Admin endpoints are only accessible from localhost.",
  "ip": "192.168.1.100"
}
```

---

## Workflow

1. **User Submission**: Users submit new terms or edits via the frontend form
2. **Storage**: Submissions are stored in `server/data/glossary-submissions.json` with status "pending"
3. **Review**: Admins can view all submissions via `/api/glossary/submissions`
4. **Approval**: Admins approve submissions via `/api/glossary/approve/:submissionId`
5. **Publication**: Approved terms are automatically added to `public/content/glossary.json` and sorted alphabetically

## File Structure

```
server/
├── data/
│   ├── glossary-submissions.json  # All user submissions
│   ├── feedback.json              # User feedback
│   └── subscribers.json           # Newsletter subscribers
└── index.js                       # Express server

public/
└── content/
    └── glossary.json              # Published glossary (en & zh)
```

## Testing

### Submit a new term (English)
```bash
curl -X POST http://localhost:3001/api/glossary \
  -H "Content-Type: application/json" \
  -d '{
    "term": "Smart Contract",
    "definition": "A self-executing contract with terms directly written into code.",
    "category": "Ethereum",
    "tags": ["code", "automation"],
    "difficulty": "intermediate",
    "language": "en",
    "mode": "create"
  }'
```

### Get all submissions (localhost only)
```bash
curl http://localhost:3001/api/glossary/submissions
```

### Approve a submission (localhost only)
```bash
curl -X POST http://localhost:3001/api/glossary/approve/1234567890
```

### Test from remote (should fail with 403)
```bash
curl http://your-server-ip:3001/api/glossary/submissions
# Response: {"success":false,"message":"Access denied. Admin endpoints are only accessible from localhost."}
```

## Security Notes

- **Public endpoints**: `/api/glossary` (submit) - accessible from anywhere
- **Admin endpoints**: `/api/glossary/submissions`, `/api/glossary/approve/:id` - **localhost only**
- Admin endpoints check the client IP address and only allow connections from localhost
- IPv4 and IPv6 localhost addresses are supported
- Failed admin access attempts are logged to the console

## Implementation Notes

- The API automatically generates term IDs from the term name if not provided
- Terms are sorted alphabetically when published to glossary.json
- The language parameter determines which section (en/zh) of glossary.json is updated
- All submissions are preserved with their status for audit purposes
- For production deployment, consider implementing additional authentication (JWT, API keys, etc.)
