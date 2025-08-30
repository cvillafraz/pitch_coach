from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import requests
import os

# Get your Supabase project settings
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET", "your_supabase_jwt_secret")
SUPABASE_PROJECT_ID = os.environ.get("SUPABASE_PROJECT_ID", "your_project_id")

bearer_scheme = HTTPBearer()

def verify_supabase_jwt(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    try:
        # Optionally, fetch JWKS from Supabase and verify signature
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
