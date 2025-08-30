# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `uv` for Python dependency management
- **Start development server**: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- **Install dependencies**: `uv sync` or `pip install -r requirements.txt`
- **Install development dependencies**: `uv sync --group dev`
- **Run tests**: `pytest` (requires dev dependencies)
- **Python version**: 3.13 (specified in .python-version)

## Architecture Overview

**Framework**: FastAPI with Python 3.13
**Authentication**: Supabase JWT verification with JOSE
**AI Integration**: Hume API for emotion analysis
**Dependencies**: Managed via both pyproject.toml (uv) and requirements.txt (pip fallback)

### Key Files

- **`main.py`**: FastAPI application with CORS middleware and main routes
  - Root endpoint (`/`) - Basic health check
  - Protected endpoint (`/protected`) - Requires JWT authentication
  - Dashboard endpoint (`/dashboard`) - Returns mock user data with authentication
- **`auth.py`**: Supabase JWT authentication utilities
  - `verify_supabase_jwt()` dependency for protected routes
  - Uses HTTPBearer scheme with JWT token validation
- **`hello.py`**: Hume API integration example for emotion analysis
  - Demonstrates batch processing for face emotion detection
  - Requires HUME_API_KEY environment variable

### Authentication Flow

- JWT tokens verified using Supabase project settings
- Required environment variables:
  - `SUPABASE_JWT_SECRET`: JWT signing secret
  - `SUPABASE_PROJECT_ID`: Supabase project identifier
  - `HUME_API_KEY`: For emotion analysis features
- Protected routes use `Depends(verify_supabase_jwt)` for authentication
- Bearer token authentication scheme via HTTP Authorization header

### API Structure

**Base Configuration**:
- CORS middleware allows all origins (adjust for production)
- FastAPI automatic API documentation available at `/docs`

**Authentication Pattern**:
```python
@app.get("/endpoint")
def protected_endpoint(user=Depends(verify_supabase_jwt)):
    # user contains decoded JWT payload
    return response
```

### Dependencies

**Core Dependencies**:
- `fastapi==0.116.1`: Web framework
- `uvicorn==0.35.0`: ASGI server
- `python-jose==3.5.0`: JWT handling
- `hume>=0.11.3`: Emotion analysis API client
- `pydantic==2.11.7`: Data validation

**Development Dependencies**:
- `pytest>=8.4.1`: Testing framework

### Project Context

This FastAPI backend serves a pitch coaching application with:
- User authentication via Supabase
- Mock dashboard data for practice sessions and user metrics
- Integration with Hume API for emotion analysis during pitch practice
- Designed to work alongside a Next.js frontend in the parent directory