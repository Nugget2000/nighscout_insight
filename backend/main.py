from fastapi import FastAPI
from api import data

app = FastAPI(
    title="Nightscout Insight API",
    description="API för att hämta och analysera Nightscout-data.",
    version="0.1.0"
)

@app.get("/", tags=["Status"])
def read_root():
    """Enkel endpoint för att verifiera att servern körs."""
    return {"status": "ok"}

app.include_router(data.router, prefix="/api/v1")
