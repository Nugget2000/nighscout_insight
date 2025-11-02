export interface Entry {
  _id: string;
  type: string;
  date: number;
  dateString: string;
  date_date: string;
  cached_at: string;
  sgv?: number;
  trend?: number;
  direction?: string;
  device: string;
  utcOffset: number;
  sysTime: string;
  mmol: number;
}
