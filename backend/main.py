from fastapi import FastAPI

app = FastAPI(
    title="Nightscout Insight API",
    description="API för att hämta och analysera Nightscout-data.",
    version="0.1.0"
)

@app.get("/", tags=["Status"])
def read_root():
    """Enkel endpoint för att verifiera att servern körs."""
    return {"status": "ok"}

# Här kommer vi senare att inkludera våra API-routers från api-katalogen
