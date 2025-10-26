# Gemini - Frontend Konventioner

Detta dokument specificerar hur Gemini-assistenten ska interagera med frontend-koden.

## Mål

Målet med frontend är att skapa ett vackert, intuitivt och informativt gränssnitt som hjälper användaren att snabbt förstå sin diabetesdata och agera på insikter.

## Filstruktur

Följ denna struktur när du lägger till eller ändrar kod:

*   `src/pages`: Huvudsidor i applikationen (t.ex. `Dashboard.tsx`, `Trends.tsx`). Varje sida ansvarar för att hämta sin data och komponera ihop UI-komponenter.
*   `src/components`: Återanvändbara UI-komponenter.
    *   `ui/`: Små, generiska komponenter (Button, Card, Spinner etc.).
    *   `charts/`: Specifika graf-komponenter (t.ex. `TIRChart.tsx`, `GlucoseDistributionChart.tsx`).
    *   `layout/`: Sid-layout, navigation, header etc.
*   `src/services`: Logik för att kommunicera med backend.
    *   `api.ts`: En konfigurerad Axios- eller fetch-instans för att göra anrop.
    *   `queries.ts`: Innehåller React Query-hooks (t.ex. `useSummaryData`, `useInsights`).
*   `src/lib` eller `src/utils`: Hjälpfunktioner, konstanter och typdefinitioner.
*   `src/types`: Globala TypeScript-typer, speciellt de som delas med backend.

## Arbetsflöde

*   **Lägg till en vy:** Skapa en ny fil i `src/pages`. Skapa en query-hook i `src/services/queries.ts` för att hämta datan. Bygg upp sidan med komponenter från `src/components`.
*   **Styling:** Använd det valda styling-biblioteket (t.ex. MUI) konsekvent. Undvik inline-styles där det går.
*   **State Management:** Använd React Query för all server-data. För global UI-state (t.ex. tema, vald tidsperiod), kan `Zustand` eller `React Context` användas.
*   **Komponentdesign:** Bygg små, fokuserade komponenter. En komponent ska göra en sak och göra den bra.
