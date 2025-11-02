import { AppBar, Button, ButtonGroup, Container, CssBaseline, Grid, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getEntries, getKpis } from './services/nightscoutService';
import BloodGlucoseChart from './components/BloodGlucoseChart';
import { useState } from 'react';
import KpiCard from './components/KpiCard';

function App() {
  const [date, setDate] = useState(new Date());

  const dateString = date.toISOString().slice(0, 10);

  const { data: entriesData, error: entriesError, isLoading: entriesIsLoading } = useQuery({ 
    queryKey: ['entries', dateString], 
    queryFn: () => getEntries(dateString) 
  });

  const { data: kpiData, error: kpiError, isLoading: kpiIsLoading } = useQuery({ 
    queryKey: ['kpis', dateString], 
    queryFn: () => getKpis(dateString) 
  });

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Nightscout Insight</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <ButtonGroup sx={{ mb: 2 }}>
          <Button onClick={handlePrevDay}>Previous Day</Button>
          <Button onClick={handleNextDay}>Next Day</Button>
        </ButtonGroup>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard for {dateString}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {entriesIsLoading && <Typography>Loading chart...</Typography>}
            {entriesError && <Typography>Error loading chart: {entriesError.message}</Typography>}
            {entriesData && <BloodGlucoseChart entries={entriesData} />}
          </Grid>
          <Grid item xs={12} md={4}>
            {kpiIsLoading && <Typography>Loading KPI...</Typography>}
            {kpiError && <Typography>Error loading KPI: {kpiError.message}</Typography>}
            {kpiData && <KpiCard kpi={kpiData} />}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
