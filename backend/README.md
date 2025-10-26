# Nightscout Insight - Backend

Detta är backend-tjänsten för Nightscout Insight. Den är byggd med Python och FastAPI.

## Ansvarsområden

1.  **Autentisering:** Validerar API-nycklar för att säkra åtkomst.
2.  **Datainsamling:** Hämtar dagligen rådata (blodsocker, behandlingar, kolhydrater) från en extern Nightscout MongoDB-databas.
3.  **Databehandling & Cachning:** Sammanställer rådata till dagliga KPI:er (TIR, medelvärde, SD, CV, eA1c etc.) och lagrar dessa i en Firestore-databas för snabb åtkomst.
4.  **API:** Exponerar REST-endpoints för frontend att hämta sammanställd data per dag, vecka, månad och år.
5.  **AI-analys:** Anropar Gemini API med data för att generera insikter, identifiera trender och ge rekommendationer.
6.  **Rapportering:** Genererar och mailar PDF-rapporter till en fördefinierad lista med mottagare.

## Teknisk Stack

*   **Framework:** FastAPI
*   **Språk:** Python 3.11+
*   **Databas (Cache):** Google Firestore
*   **Datamodeller:** Pydantic
*   **Schemaläggning:** Google Cloud Scheduler (konfigureras i GCP)

## Komma igång

### 1. Installation

```bash
# Klona repot (om du inte redan gjort det)
git clone <repo_url>
cd nightscout-insight/backend

# Skapa och aktivera en virtuell miljö
python3 -m venv .venv
source .venv/bin/activate

# Installera beroenden
pip install -r requirements.txt
```

### 2. Konfiguration

Skapa en `.env`-fil i `backend`-katalogen med följande variabler:

```
# Nightscout
NS_URL="https://<ditt-nightscout-namn>.herokuapp.com"
NS_API_SECRET="<ditt-nightscout-api-secret>"

# Egen API-nyckel för att skydda ditt API
API_KEY_SECRET="<generera-en-stark-hemlighet>"

# GCP
GCP_PROJECT_ID="<ditt-gcp-projekt-id>"
# (Autentisering till GCP hanteras via service account i produktion)

# Gemini
GEMINI_API_KEY="<din-gemini-api-nyckel>"

# E-post
MAIL_SENDER="noreply@dindomän.com"
MAIL_RECIPIENTS="mottagare1@exempel.com,mottagare2@exempel.com"
# (Använd SendGrid, Mailgun eller liknande för att skicka mail)
```

### 3. Köra lokalt

```bash
uvicorn main:app --reload
```
