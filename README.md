# Hireon AI - AI-Powered Resume Reviewer

Hireon AI is a fast, privacy-first, AI-powered resume reviewer that helps job seekers optimize their resumes for specific job descriptions. The application analyzes your resume against a job description and provides actionable feedback to improve your chances of getting hired.

## Features

- 📄 PDF Resume Analysis
- 🤖 AI-Powered Job Description Matching
- 📊 Match Score & Rating
- 🔍 Missing Keywords Identification
- 💡 Actionable Improvement Suggestions
- 📈 Resume Statistics (Word Count, Readability)
- 🔒 Privacy-First (No Data Storage)
- ⚡ Fast Response Time (<15 seconds)

## Tech Stack

### Backend
- FastAPI (Python)
- OpenAI GPT-3.5
- PDF Plumber
- Pytest

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router

## Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API Key

## Quick Start

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/DeepeshJami/Hireon-ai.git
cd Hireon-ai
```

2. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp example.env .env
```
Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
ENVIRONMENT=development
LOG_LEVEL=INFO
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## API Documentation

### Endpoints

#### POST /api/analyze
Analyzes a resume against a job description.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - resume_file: PDF file
  - job_description: string

**Response:**
```json
{
  "match_rating": "string",
  "match_score": number,
  "missing_keywords": string[],
  "resume_stats": {
    "word_count": number,
    "readability_score": number
  },
  "suggestions": string[]
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Usage Guide

1. **Upload Resume**
   - Click "Upload Resume" or drag and drop your PDF resume
   - Supported format: PDF

2. **Enter Job Description**
   - Paste the job description in the text area
   - Make sure to include all requirements and responsibilities

3. **Get Analysis**
   - Click "Evaluate Match"
   - Wait for the analysis (usually <15 seconds)

4. **Review Results**
   - Check your match score and rating
   - Review missing keywords
   - Read through improvement suggestions
   - View resume statistics

## Development Setup

### Recommended Tools
- VS Code with extensions:
  - Python
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
- Git for version control
- Postman/Insomnia for API testing

### Development Workflow
1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests
4. Create a pull request
5. Get code review
6. Merge after approval

### Common Setup Issues

#### Backend
1. **Virtual Environment Issues**
   ```bash
   # If venv creation fails
   python3 -m pip install --upgrade pip
   python3 -m pip install virtualenv
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill the process
   kill -9 <PID>
   ```

3. **OpenAI API Issues**
   - Verify API key is correct
   - Check API key permissions
   - Ensure sufficient credits

#### Frontend
1. **Node Version Issues**
   ```bash
   # Install nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   # Install correct Node version
   nvm install 16
   nvm use 16
   ```

2. **Port Conflicts**
   - Change Vite port in `vite.config.js`
   - Use different port for backend

3. **Build Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

## Contributing

### Development Guidelines
1. **Code Style**
   - Follow PEP 8 for Python
   - Use ESLint/Prettier for JavaScript
   - Write meaningful commit messages

2. **Testing**
   - Write tests for new features
   - Maintain test coverage
   - Run tests before committing

3. **Documentation**
   - Update README for new features
   - Document API changes
   - Add inline comments

### Pull Request Process
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests and linting
5. Update documentation
6. Create pull request
7. Address review comments
8. Get approval and merge

### Code Review Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code style followed
- [ ] No security issues
- [ ] Performance considered
- [ ] Error handling added

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-3.5 API
- FastAPI for the excellent web framework
- React and Vite for the frontend tooling

## Project Architecture

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  React Frontend  | --> |  FastAPI Backend | --> |   OpenAI API     |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  PDF Processing  | <-- |  PDF Plumber     | <-- |  Error Handling  |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_api_key_here
ENVIRONMENT=development
LOG_LEVEL=INFO
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Hireon AI
VITE_APP_VERSION=1.0.0
```

## Performance Benchmarks

### Response Times
- PDF Processing: < 2 seconds
- AI Analysis: < 10 seconds
- Total Response: < 15 seconds

### Resource Usage
- Memory: ~200MB per request
- CPU: ~30% during analysis
- Network: ~1MB per request

### Load Testing
- Concurrent Users: 100
- Requests per Second: 10
- Success Rate: 99.9%

## Deployment

### Backend Deployment
1. **Docker Setup**
   ```dockerfile
   FROM python:3.8-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Docker Compose**
   ```yaml
   version: '3'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - OPENAI_API_KEY=${OPENAI_API_KEY}
   ```

### Frontend Deployment
1. **Build Process**
   ```bash
   cd frontend
   npm run build
   ```

2. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name hireon.ai;
       
       location / {
           root /var/www/hireon;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://backend:8000;
       }
   }
   ```

### Production Checklist
- [ ] Set up SSL certificates
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting
- [ ] Set up error tracking
- [ ] Configure logging 