# Gemini - Backend Konventioner

Detta dokument specificerar hur Gemini-assistenten ska interagera med backend-koden.

## Mål

Målet med backend är att på ett effektivt och pålitligt sätt hämta, bearbeta, cacha och servera diabetesdata, samt att använda AI för att skapa meningsfulla insikter.

## Filstruktur

Följ denna struktur när du lägger till eller ändrar kod:

*   `main.py`: FastAPI app-instans och API-routers. Håll denna fil ren och delegera logik.
*   `/api`: Innehåller API-endpoints, uppdelade i logiska filer (t.ex. `summary.py`, `insights.py`).
*   `/services`: Kärnlogik. All interaktion med externa tjänster (Nightscout, Firestore, Gemini) och all databearbetning ska ligga här.
    *   `nightscout_service.py`: Hämtar data från Nightscout.
    *   `cache_service.py`: Läser från och skriver till Firestore.
    *   `analysis_service.py`: Anropar Gemini och formaterar resultatet.
    *   `reporting_service.py`: Skapar och skickar rapporter.
*   `/models`: Pydantic-modeller för API-anrop, svar och databasstrukturer.
*   `/core`: Konfiguration och återanvändbara komponenter (t.ex. API-nyckel-autentisering).
*   `/jobs`: Logik för schemalagda jobb, t.ex. den dagliga cachningen.

## Arbetsflöde

*   **Lägg till en endpoint:** Skapa en Pydantic-modell i `/models`, lägg till funktionen i en relevant fil under `/api`, och implementera affärslogiken i en funktion i `/services`.
*   **Ändra datamodell:** Uppdatera Pydantic-modellen i `/models` och säkerställ att all kod som använder den anpassas.
*   **Effektivitet:** Kom ihåg att Nightscout-databasen är långsam. All data som kan cachas ska cachas i Firestore. API-endpoints ska i första hand alltid läsa från Firestore-cachen.
