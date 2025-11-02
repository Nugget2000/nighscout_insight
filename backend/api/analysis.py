from fastapi import APIRouter, Security
from services.nightscout_service import get_nightscout_entries, get_nightscout_treatments
from services.kpi_service import calculate_kpis
from services.gemini_service import analyze_day_data
from core.config import settings
from core.security import get_api_key
from models.kpi import Kpis

router = APIRouter()

@router.get("/analysis/{date}", tags=["Analysis"])
def get_analysis(date: str, api_key: str = Security(get_api_key)):
    """Generates a Gemini analysis for a specific date."""
    from_date = f"{date}T00:00:00"
    to_date = f"{date}T23:59:59"

    entries = get_nightscout_entries(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        from_date=from_date,
        to_date=to_date
    )
    if not entries:
        return {"analysis": "Not enough data for analysis."}

    treatments = get_nightscout_treatments(
        nightscout_url=settings.NS_URL,
        api_token=settings.NS_TOKEN,
        from_date=from_date,
        to_date=to_date
    )

    kpis_dict = calculate_kpis(entries)
    kpis = Kpis(date=date, **kpis_dict)

    analysis = analyze_day_data(entries, treatments, kpis)
    return {"analysis": analysis}
