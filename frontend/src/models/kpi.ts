export interface Kpis {
  date: string;
  mean_glucose: number;
  std_dev: number;
  cv: number;
  tir_percent: number;
  tir_accepted: boolean;
  tar_percent: number;
  tbr_percent: number;
  titr_percent: number;
  titr_accepted: boolean;
  ea1c: number;
  total_readings: number;
  total_readings_accepted: boolean;
}
