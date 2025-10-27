from fastapi import APIRouter, Depends, Security
from typing import List

from services.nightscout_service import get_nightscout_entries, get_nightscout_treatments
from core.config import settings
from core.security import get_api_key
from models.entry import Entry
from models.treatment import Treatment

router = APIRouter()

@router.get("/entries", response_model=List[Entry], tags=["Data"])
def get_entries(count: int = 1, api_key: str = Security(get_api_key)):
    """Hämtar de senaste posterna från Nightscout."""
    entries = get_nightscout_entries(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        count=count
    )
    return entries if entries is not None else []

@router.get("/treatments", response_model=List[Treatment], tags=["Data"])
def get_treatments(count: int = 1, api_key: str = Security(get_api_key)):
    """Hämtar de senaste behandlingarna från Nightscout."""
    treatments = get_nightscout_treatments(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        count=count
    )
    return treatments if treatments is not None else []
