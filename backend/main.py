from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import data, analysis

app = FastAPI(
    title="Nightscout Insight API",
    description="API för att hämta och analysera Nightscout-data.",
    version="0.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/", tags=["Status"])
def read_root():
    """Enkel endpoint för att verifiera att servern körs."""
    return {"status": "ok"}

app.include_router(data.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
