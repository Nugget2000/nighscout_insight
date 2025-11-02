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
        "You are an expert diabetes coach. Your task is to analyze a user's glucose data, "
        "treatments, and key performance indicators (KPIs) for a single day. Provide a concise, "
        "insightful analysis and actionable recommendations. Structure your response in a consise manner."
        "You always answer in swedish and keep keep the answers brief and prioritize achievments and things"
        "to improve or investigate." \
        "Also provide a small summary of what treaments has occured, for example if there was many temp basals, " \
        "pump changes, correction bolus or other events. "
        "\n\n"
        "## Daily Summary\n"
        f"**Date:** {kpis.date}\n"
        f"**Time in Range (TIR):** {kpis.tir_percent:.1f}% (Target: >70%)\n"
        f"**Time in Tight Range (TITR):** {kpis.titr_percent:.1f}% (Target: >50%)\n"
        f"**Mean Glucose:** {kpis.mean_glucose:.1f} mmol/L\n"
        f"**Standard Deviation:** {kpis.std_dev:.1f}\n"
        f"**eA1c:** {kpis.ea1c:.1f}%\n"
        "\n"
        "## Analysis\n"
        "Based on the data, here is an analysis of the day, highlighting periods of high and low glucose, "
        "and potential correlations with meals or insulin doses."
        "\n"
        "## Recommendations\n"
        "Here are some concrete recommendations for improving glucose control based on today's patterns."
        "\n\n"
        "Here is the raw data for the day:\n"
        f"**KPIs:**\n{kpis.model_dump_json(indent=2)}\n\n"
        f"**Glucose Entries (sample):**\n{[entry.model_dump_json() for entry in entries[:10]]}...\n\n"
        f"**Treatments (sample):**\n{[treatment.model_dump_json() for treatment in treatments[:5]]}...\n"
    )

    response = model.generate_content(prompt)
    analysis_text = response.text
    set_cache(cache_key, analysis_text)
    return analysis_text
