import google.generativeai as genai
from typing import List

from core.config import settings
from models.entry import Entry
from models.treatment import Treatment
from models.kpi import Kpis
from core.cache import get_cache, set_cache

genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_day_data(entries: List[Entry], treatments: List[Treatment], kpis: Kpis) -> str:
    """Analyzes the day's data using the Gemini API."""

    cache_key = f"analysis_{kpis.date}"
    cached_analysis = get_cache(cache_key)
    if cached_analysis:
        return cached_analysis

    model = genai.GenerativeModel('gemini-2.5-pro')

    prompt = (
        """Du är en expert på typ 1-diabetes och tolkning av data från automatiserade insulinsystem.
        Patienten är Erik, en 12-årig pojke med typ 1-diabetes. Han är oftast fysiskt aktiv men har vissa dagar då han tillbringar många timmar vid datorn.
        Han använder Loop med Omnipod som insulinpump och Dexcom G7 för kontinuerlig glukosmätning (CGM).
        Loop-systemet registrerar alla bolusdoser, basala förändringar, auto-korrigeringar, pumpbyten och andra händelser.
        Din uppgift är att utifrån den tillgängliga datan för en given dag skapa en sammanfattning av glukosvariationer och behandlingsaktiviteter.
        Sammanfattningen ska:
        Vara skriven på svenska, anpassad för vårdpersonal och/eller föräldrar.
        Lyfta fram positiva observationer (t.ex. stabil glukosnivåer, snabb korrigering av höga/låga värden, god TIR).
        Prioritera att identifiera områden för förbättring eller vidare analys, till exempel:
        återkommande hypoglykemier eller hyperglykemier,
        trender relaterade till fysisk aktivitet eller stillasittande,
        möjliga justeringar i kolhydratkvot, insulinkänslighet eller basalprofil,
        tidsperioder då Loop-systemet auto-korrigerar ofta,
        avvikande beteenden (t.ex. missade boluser, sent kvällsmål, pumpavbrott).
        Avsluta med förslag på nästa steg i optimeringen av Erik’s diabetesbehandling.

        Här är sammanhanget och datan för dagen:"""
        "\n\n"
        f"**Date:** {kpis.date}\n"
        f"**Time in Range (TIR):** {kpis.tir_percent:.1f}% (Target: >70%)\n"
        f"**Time in Tight Range (TITR):** {kpis.titr_percent:.1f}% (Target: >50%)\n"
        f"**Mean Glucose:** {kpis.mean_glucose:.1f} mmol/L\n"
        f"**Standard Deviation:** {kpis.std_dev:.1f}\n"
        f"**eA1c:** {kpis.ea1c:.1f}%\n"
        "\n"
        f"**KPIs:**\n{kpis.model_dump_json(indent=2)}\n\n"
        f"**Glucose Entries (sample):**\n{[entry.model_dump_json() for entry in entries[:10]]}...\n\n"
        f"**Treatments (sample):**\n{[treatment.model_dump_json() for treatment in treatments[:5]]}...\n"
    )

    response = model.generate_content(prompt)
    analysis_text = response.text
    set_cache(cache_key, analysis_text)
    return analysis_text
