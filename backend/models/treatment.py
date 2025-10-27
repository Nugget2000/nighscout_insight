from pydantic import BaseModel
from typing import Optional

class Treatment(BaseModel):
    """Pydantic model for a Nightscout treatment."""
    _id: str
    eventType: str
    created_at: str
    cached_at: str
    glucose: Optional[str] = None
    glucoseType: Optional[str] = None
    carbs: Optional[int] = None
    protein: Optional[int] = None
    fat: Optional[int] = None
    insulin: Optional[float] = None
    units: Optional[str] = None
    notes: Optional[str] = None
    enteredBy: Optional[str] = None
