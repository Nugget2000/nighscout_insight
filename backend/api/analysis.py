from fastapi import APIRouter, Security, HTTPException
from datetime import datetime, timedelta
from typing import List
from services.nightscout_service import get_nightscout_entries, get_nightscout_treatments
from services.kpi_service import calculate_kpis
from services.gemini_service import analyze_day_data, analyze_week_data
from core.config import settings
from core.security import get_api_key
from models.kpi import Kpis

router = APIRouter()

def _get_week_analysis_data(date: str):
    """
    Helper function to generate analysis for a full week.
    The date parameter should be any date within the desired week.
    """
    try:
        parsed_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Please use YYYY-MM-DD.")

    start_of_week = parsed_date - timedelta(days=parsed_date.weekday())
    
    week_data = []
    
    for day_offset in range(7):
        current_date = start_of_week + timedelta(days=day_offset)
        date_str = current_date.strftime("%Y-%m-%d")
        
        from_date = f"{date_str}T00:00:00"
        to_date = f"{date_str}T23:59:59"
        
        entries = get_nightscout_entries(
            nightscout_url=settings.NS_URL,
            api_token=settings.NS_TOKEN,
            from_date=from_date,
            to_date=to_date
        )
        
        treatments = get_nightscout_treatments(
            nightscout_url=settings.NS_URL,
            api_token=settings.NS_TOKEN,
            from_date=from_date,
            to_date=to_date
        )
        
        if entries:
            kpis_dict = calculate_kpis(entries)
            kpis = Kpis(date=date_str, **kpis_dict)
            
            day_info = {
                "date": date_str,
                "day_of_week": current_date.strftime("%A"),
                "kpis": kpis,
                "entries": entries,
                "treatments": treatments,
                "entries_count": len(entries),
                "treatments_count": len(treatments) if treatments else 0
            }
        else:
            day_info = {
                "date": date_str,
                "day_of_week": current_date.strftime("%A"),
                "kpis": None,
                "entries": [],
                "treatments": [],
                "entries_count": 0,
                "treatments_count": 0,
                "error": "No data available for this day"
            }
        
        week_data.append(day_info)
    
    week_result = {
        "week_start": start_of_week.strftime("%Y-%m-%d"),
        "week_end": (start_of_week + timedelta(days=6)).strftime("%Y-%m-%d"),
        "daily_analysis": week_data
    }
    
    week_analysis = analyze_week_data(week_result)
    week_result["analysis"] = week_analysis
    
    return week_result

@router.get("/analysis/week", tags=["Analysis"])
def get_current_week_analysis(api_key: str = Security(get_api_key)):
    """
    Generates analysis for the current week.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    return _get_week_analysis_data(today_str)

@router.get("/analysis/week/{date}", tags=["Analysis"])
def get_week_analysis(date: str, api_key: str = Security(get_api_key)):
    """
    Generates analysis for a full week using daily data retrieval.
    The date parameter should be any date within the desired week.
    Returns KPIs and daily data for all 7 days of that week.
    """
    return _get_week_analysis_data(date)

@router.get("/analysis/{date}", tags=["Analysis"])
def get_analysis(date: str, api_key: str = Security(get_api_key)):
    """Generates a Gemini analysis for a specific date."""
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format for daily analysis. Please use YYYY-MM-DD.")

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