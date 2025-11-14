import { Kpis } from './kpi';

export interface DailyAnalysis {
  date: string;
  day_of_week: string;
  kpis: Kpis | null;
  entries_count: number;
  treatments_count: number;
  error?: string;
}

export interface WeekAnalysis {
  week_start: string;
  week_end: string;
  daily_analysis: DailyAnalysis[];
  analysis: string;
}
