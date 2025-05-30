# Hireon AI API Documentation

## Overview

The Hireon AI API provides endpoints for analyzing resumes against job descriptions using AI. The API is built with FastAPI and follows RESTful principles.

## Base URL

- Development: `http://localhost:8000`
- Production: `https://api.hireon.ai` (TBD)

## Authentication

Currently, the API does not require authentication. However, an OpenAI API key is required for the backend to function.

## Endpoints

### Health Check

#### GET /health

Checks if the API is running and healthy.

**Response:**
```json
{
  "status": "healthy"
}
```

**Status Codes:**
- 200: API is healthy
- 500: Internal server error

### Resume Analysis

#### POST /api/analyze

Analyzes a resume against a job description using AI.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - resume_file: PDF file (required)
  - job_description: string (required)

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "resume_file=@/path/to/resume.pdf" \
  -F "job_description=Senior Software Engineer position requiring Python, React, and AWS experience..."
```

**Response:**
```json
{
  "match_rating": "Fair",
  "match_score": 65,
  "missing_keywords": [
    "Python",
    "Kubernetes",
    "Figma",
    "Elasticsearch",
    "AWS",
    "GCP",
    "Agile sprints",
    "Version control",
    "CI/CD",
    "DevOps"
  ],
  "resume_stats": {
    "word_count": 729,
    "readability_score": 0.95
  },
  "suggestions": [
    "Highlight experience with Python and Kubernetes to showcase technical skills.",
    "Include Figma and Elasticsearch experience to demonstrate proficiency in design and data management.",
    "Add AWS or GCP experience if applicable to highlight cloud readiness.",
    "Quantify your achievements with metrics to increase impact.",
    "Emphasize experience with Agile sprints and version control methodologies.",
    "Highlight CI/CD and DevOps experience to showcase proficiency in software development lifecycle.",
    "Include measurable results like 'reduced costs by 20%'."
  ]
}
```

**Status Codes:**
- 200: Analysis successful
- 400: Invalid request (missing file or job description)
- 422: Validation error (invalid file format)
- 500: Internal server error

**Error Response:**
```json
{
  "detail": "Error message here"
}
```

## Rate Limiting

### Current Limits
- 100 requests per hour per IP
- 1000 requests per day per IP
- Maximum file size: 10MB

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1616123456
```

### Rate Limit Exceeded Response
```json
{
  "detail": "Rate limit exceeded. Please try again in 3600 seconds.",
  "retry_after": 3600
}
```

## Error Responses

### Common Error Examples

1. **Invalid File Format**
```json
{
  "detail": "Only PDF files are supported. Please upload a PDF file."
}
```

2. **File Too Large**
```json
{
  "detail": "File size exceeds maximum limit of 10MB."
}
```

3. **Missing Required Field**
```json
{
  "detail": [
    {
      "loc": ["body", "job_description"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

4. **OpenAI API Error**
```json
{
  "detail": "OpenAI API error: Rate limit exceeded. Please try again later."
}
```

## API Versioning

### Version Strategy
- Current version: v1
- Version specified in URL: `/api/v1/analyze`
- Version specified in header: `Accept: application/vnd.hireon.v1+json`

### Version Lifecycle
1. **Active Versions**
   - v1 (Current)
   - v2 (Beta)

2. **Deprecated Versions**
   - None currently

3. **Version Sunset Policy**
   - 6 months notice before deprecation
   - 3 months grace period after deprecation
   - Email notifications to registered users

## Security

### Data Protection
- All data processed in-memory
- No persistent storage
- Files deleted after processing
- HTTPS required in production

### Best Practices
1. **API Key Security**
   - Store API keys in environment variables
   - Rotate keys regularly
   - Use key restrictions

2. **Request Security**
   - Validate all inputs
   - Sanitize file names
   - Check file contents

3. **Response Security**
   - No sensitive data in responses
   - Proper CORS configuration
   - Rate limiting headers

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Best Practices

1. **File Size**
   - Keep PDF files under 10MB
   - Optimize PDFs before uploading

2. **Job Description**
   - Include complete job requirements
   - Format text properly
   - Avoid special characters

3. **Error Handling**
   - Implement proper error handling on the client side
   - Display user-friendly error messages
   - Retry failed requests with exponential backoff

## Future Updates

1. **Planned Features**
   - Authentication
   - Rate limiting
   - Batch processing
   - Custom analysis parameters

2. **API Versioning**
   - Version 2.0 will introduce breaking changes
   - Current version will be maintained for backward compatibility

## Support

For API support or to report issues:
1. Open an issue on GitHub
2. Contact the development team
3. Check the project documentation

## Webhooks

### Configuration
```json
{
  "webhook_url": "https://your-domain.com/webhook",
  "events": ["analysis.completed", "analysis.failed"],
  "secret": "your_webhook_secret"
}
```

### Event Types
1. **analysis.completed**
   ```json
   {
     "event": "analysis.completed",
     "data": {
       "analysis_id": "123",
       "match_score": 75,
       "timestamp": "2024-03-19T12:00:00Z"
     }
   }
   ```

2. **analysis.failed**
   ```json
   {
     "event": "analysis.failed",
     "data": {
       "analysis_id": "123",
       "error": "Invalid file format",
       "timestamp": "2024-03-19T12:00:00Z"
     }
   }
   ```

## Batch Processing

### POST /api/analyze/batch
Process multiple resumes against a job description.

**Request:**
```json
{
  "job_description": "string",
  "resume_files": [
    {
      "file": "base64_encoded_pdf",
      "filename": "resume1.pdf"
    },
    {
      "file": "base64_encoded_pdf",
      "filename": "resume2.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "batch_id": "batch_123",
  "results": [
    {
      "filename": "resume1.pdf",
      "match_score": 75,
      "status": "completed"
    },
    {
      "filename": "resume2.pdf",
      "match_score": 65,
      "status": "completed"
    }
  ]
}
```

## API Status Codes

### Success Codes
- 200: OK
- 201: Created
- 202: Accepted
- 204: No Content

### Client Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Unprocessable Entity
- 429: Too Many Requests

### Server Error Codes
- 500: Internal Server Error
- 502: Bad Gateway
- 503: Service Unavailable
- 504: Gateway Timeout

## Code Examples

### Python
```python
import requests

def analyze_resume(resume_path, job_description):
    url = "http://localhost:8000/api/analyze"
    files = {"resume_file": open(resume_path, "rb")}
    data = {"job_description": job_description}
    
    response = requests.post(url, files=files, data=data)
    return response.json()
```

### JavaScript
```javascript
async function analyzeResume(resumeFile, jobDescription) {
  const formData = new FormData();
  formData.append('resume_file', resumeFile);
  formData.append('job_description', jobDescription);

  const response = await fetch('http://localhost:8000/api/analyze', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}
```

### cURL
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "resume_file=@/path/to/resume.pdf" \
  -F "job_description=Senior Software Engineer position..."
```

### Go
```go
package main

import (
    "bytes"
    "mime/multipart"
    "net/http"
)

func analyzeResume(resumePath string, jobDescription string) error {
    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    
    file, err := os.Open(resumePath)
    if err != nil {
        return err
    }
    defer file.Close()
    
    part, err := writer.CreateFormFile("resume_file", "resume.pdf")
    if err != nil {
        return err
    }
    
    _, err = io.Copy(part, file)
    if err != nil {
        return err
    }
    
    err = writer.WriteField("job_description", jobDescription)
    if err != nil {
        return err
    }
    
    err = writer.Close()
    if err != nil {
        return err
    }
    
    req, err := http.NewRequest("POST", "http://localhost:8000/api/analyze", body)
    if err != nil {
        return err
    }
    
    req.Header.Set("Content-Type", writer.FormDataContentType())
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    return nil
} 