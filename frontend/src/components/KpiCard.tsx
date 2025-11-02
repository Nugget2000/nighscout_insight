import { Card, CardContent, Typography } from '@mui/material';
import { Kpis } from '../models/kpi';

interface KpiCardProps {
  kpi: Kpis;
}

const KpiCard = ({ kpi }: KpiCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Time in Range (TIR)
        </Typography>
        <Typography variant="h2" component="div" sx={{ color: kpi.tir_accepted ? 'green' : 'red' }}>
          {kpi.tir_percent.toFixed(1)}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
