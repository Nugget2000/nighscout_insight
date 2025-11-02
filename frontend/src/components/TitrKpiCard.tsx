import { Card, CardContent, Typography } from '@mui/material';
import { Kpis } from '../models/kpi';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface KpiCardProps {
  kpi: Kpis;
  kpiHistory?: Kpis[];
}

const TitrKpiCard = ({ kpi, kpiHistory }: KpiCardProps) => {
  const formattedHistory = kpiHistory?.map(k => ({ ...k, date: k.date.slice(5) })).reverse();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Time in Tight Range (TITR)
        </Typography>
        <Typography variant="h2" component="div" sx={{ color: kpi.titr_accepted ? 'green' : 'red' }}>
          {kpi.titr_percent.toFixed(1)}%
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Values between 3.9 and 7.8 mmol/L. Target above 50%
        </Typography>
        {formattedHistory && (
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={formattedHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <ReferenceLine y={50} stroke="green" />
              <Bar dataKey="titr_percent">
                {formattedHistory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.titr_accepted ? 'rgba(0, 128, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TitrKpiCard;
