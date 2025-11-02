import { Card, CardContent, Typography } from '@mui/material';
import { Kpis } from '../models/kpi';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface KpiCardProps {
  kpi: Kpis;
  kpiHistory?: Kpis[];
}

const KpiCard = ({ kpi, kpiHistory }: KpiCardProps) => {
  const formattedHistory = kpiHistory?.map(k => ({ ...k, date: k.date.slice(5) })).reverse();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Time in Range (TIR)
        </Typography>
        <Typography variant="h2" component="div" sx={{ color: kpi.tir_accepted ? 'green' : 'red' }}>
          {kpi.tir_percent.toFixed(1)}%
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Values between 3.9 and 10.0 mmol/L. Target above 70%
        </Typography>
        {formattedHistory && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={formattedHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <ReferenceLine y={70} stroke="green" />
              <Bar dataKey="tir_percent">
                {formattedHistory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.tir_accepted ? 'rgba(0, 128, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
