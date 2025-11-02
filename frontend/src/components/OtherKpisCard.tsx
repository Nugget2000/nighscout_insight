import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Kpis } from '../models/kpi';
import TrendingUp from '@mui/icons-material/TrendingUp';
import ShowChart from '@mui/icons-material/ShowChart';
import Bloodtype from '@mui/icons-material/Bloodtype';
import SavedSearch from '@mui/icons-material/SavedSearch';

interface OtherKpisCardProps {
  kpi: Kpis;
}

const OtherKpisCard = ({ kpi }: OtherKpisCardProps) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" component="div">
              <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} /> CV
            </Typography>
            <Typography variant="h4">{kpi.cv.toFixed(1)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="div">
              <ShowChart sx={{ verticalAlign: 'middle', mr: 1 }} /> Std Dev
            </Typography>
            <Typography variant="h4">{kpi.std_dev.toFixed(1)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="div">
              <Bloodtype sx={{ verticalAlign: 'middle', mr: 1 }} /> eA1c
            </Typography>
            <Typography variant="h4">{kpi.ea1c.toFixed(1)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="div">
              <SavedSearch sx={{ verticalAlign: 'middle', mr: 1 }} /> Readings
            </Typography>
            <Typography variant="h4" sx={{ color: kpi.total_readings_accepted ? 'green' : 'red' }}>
              {kpi.total_readings}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OtherKpisCard;
