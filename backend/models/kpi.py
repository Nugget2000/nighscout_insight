from pydantic import BaseModel

class Kpis(BaseModel):
    """Pydantic model for the calculated KPIs."""
    date: str
    mean_glucose: float
    std_dev: float
    cv: float
    tir_percent: float
    tir_accepted: bool
    tar_percent: float
    tbr_percent: float
    titr_percent: float
    titr_accepted: bool
    ea1c: float
    total_readings: int
    total_readings_accepted: bool
