# Nightscout Insight - Frontend

Detta är frontend-applikationen för Nightscout Insight, byggd med React och TypeScript.

## Ansvarsområden

1.  **Visualisering:** Visa KPI:er, grafer och insikter på ett snyggt och lättläst sätt.
2.  **Interaktion:** Låta användaren välja tidsperioder (dag, vecka, månad) och se detaljerad data.
3.  **Kommunikation:** Kommunicera säkert med backend-API:et genom att skicka med en API-nyckel.

## Teknisk Stack

*   **Framework:** React (med Vite eller Create React App)
*   **Språk:** TypeScript
*   **Styling:** Material-UI (MUI) eller Tailwind CSS för en modern och responsiv design.
*   **Grafbibliotek:** Recharts eller Chart.js för att rendera grafer.
*   **Datahämtning:** React Query (TanStack Query) för att hantera server-state, cachning och automatisk uppdatering.

## Komma igång

### 1. Installation

```bash
# Klona repot (om du inte redan gjort det)
git clone <repo_url>
cd nightscout-insight/frontend

# Installera beroenden
npm install
# eller
yarn install
```

### 2. Konfiguration

Skapa en `.env.local`-fil i `frontend`-katalogen med följande variabler:

```
VITE_API_BASE_URL="http://localhost:8000/api/v1"
VITE_API_KEY="<samma-hemlighet-som-i-backend>"
```
*(Notera: `VITE_` prefixet krävs om du använder Vite)*

### 3. Köra lokalt

```bash
npm run dev
# eller
yarn dev
```
