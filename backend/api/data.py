from fastapi import APIRouter, Security
from typing import List, Dict

from services.nightscout_service import get_nightscout_entries, get_nightscout_treatments
from services.kpi_service import calculate_kpis
from core.config import settings
from core.security import get_api_key
from models.entry import Entry
from models.treatment import Treatment

router = APIRouter()

@router.get("/entries", response_model=List[Entry], tags=["Data"])
def get_entries(date: str, api_key: str = Security(get_api_key)):
    """Hämtar de senaste posterna från Nightscout för ett specifikt datum."""
    from_date = f"{date}T00:00:00Z"
    to_date = f"{date}T23:59:59Z"
    entries = get_nightscout_entries(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        from_date=from_date,
        to_date=to_date
    )
    return entries if entries is not None else []

@router.get("/treatments", response_model=List[Treatment], tags=["Data"])
def get_treatments(date: str, api_key: str = Security(get_api_key)):
    """Hämtar de senaste behandlingarna från Nightscout för ett specifikt datum."""
    from_date = f"{date}T00:00:00Z"
    to_date = f"{date}T23:59:59Z"
    treatments = get_nightscout_treatments(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        from_date=from_date,
        to_date=to_date
    )
    return treatments if treatments is not None else []

@router.get("/kpis/{date}", response_model=Dict[str, float], tags=["KPIs"])
def get_kpis(date: str, api_key: str = Security(get_api_key)):
    """Beräknar och returnerar dagliga KPIer för ett specifikt datum."""
    from_date = f"{date}T00:00:00Z"
    to_date = f"{date}T23:59:59Z"
    entries = get_nightscout_entries(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        from_date=from_date,
        to_date=to_date
    )
    if not entries:
        return {}
    
    kpis = calculate_kpis(entries)
    return kpis
