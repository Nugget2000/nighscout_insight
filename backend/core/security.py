
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from core.config import settings

api_key_header = APIKeyHeader(name="X-API-Key")

def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header == settings.API_KEY_SECRET:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )
