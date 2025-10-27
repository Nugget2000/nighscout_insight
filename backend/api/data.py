from fastapi import APIRouter, Depends
from typing import List

from services.nightscout_service import get_nightscout_entries
from core.config import settings
from models.entry import Entry

router = APIRouter()

@router.get("/entries", response_model=List[Entry], tags=["Data"])
def get_entries(count: int = 1):
    """Hämtar de senaste posterna från Nightscout."""
    entries = get_nightscout_entries(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        count=count
    )
    return entries
