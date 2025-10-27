from pydantic import BaseModel, computed_field
from typing import Optional

class Entry(BaseModel):
    """Pydantic model for a Nightscout entry."""
    _id: str
    type: str
    
    date: int
    dateString: str
    cached_at: str
    sgv: Optional[int] = None
    trend: int
    direction: str
    device: str
    utcOffset: int
    sysTime: str
    # mills: int
    
    @computed_field
    @property
    def mmol(self) -> float:
        """Return sgv converted to mmol/L (sgv / 18), rounded to one decimal."""
        if self.sgv is not None:
            return round(self.sgv / 18, 1)
        return None

    