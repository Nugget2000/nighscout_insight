import { AppBar, Button, ButtonGroup, Container, CssBaseline, Grid, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getEntries, getKpis, getWeekAnalysis } from './services/nightscoutService';
import BloodGlucoseChart from './components/BloodGlucoseChart';
import { useState } from 'react';
import KpiCard from './components/KpiCard';
import { Kpis } from './models/kpi';
import TitrKpiCard from './components/TitrKpiCard';
import AnalysisCard from './components/AnalysisCard';
import OtherKpisCard from './components/OtherKpisCard';
import WeekAnalysisCard from './components/WeekAnalysisCard';
import { WeekAnalysis } from './models/weekAnalysis';

function App() {
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const dateString = date.toISOString().slice(0, 10);

  const { data: entriesData, error: entriesError, isLoading: entriesIsLoading } = useQuery({ 
    queryKey: ['entries', dateString], 
    queryFn: () => getEntries(dateString) 
  });

  const { data: kpiData, error: kpiError, isLoading: kpiIsLoading } = useQuery({ 
    queryKey: ['kpis', dateString], 
    queryFn: () => getKpis(dateString) 
  });

  const { data: kpiHistory } = useQuery<Kpis[]>({ 
    queryKey: ['kpiHistory', dateString], 
    queryFn: async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const d = new Date(date);
        d.setDate(d.getDate() - i);
        promises.push(getKpis(d.toISOString().slice(0, 10)));
      }
      return Promise.all(promises);
    }
  });

  const { data: weekAnalysis, error: weekError, isLoading: weekIsLoading } = useQuery<WeekAnalysis>({
    queryKey: ['weekAnalysis', dateString],
    queryFn: () => getWeekAnalysis(dateString),
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

  const isFuture = date.toISOString().slice(0, 10) >= new Date().toISOString().slice(0, 10);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Nightscout Insight</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={viewMode} onChange={(_, newValue) => setViewMode(newValue)}>
            <Tab label="Daily View" value="day" />
            <Tab label="Weekly View" value="week" />
          </Tabs>
        </Box>

        {viewMode === 'day' && (
          <>
            <ButtonGroup sx={{ mb: 2 }}>
              <Button onClick={handlePrevDay}>Previous Day</Button>
              <Button onClick={handleNextDay} disabled={isFuture}>Next Day</Button>
            </ButtonGroup>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard for {formatDate(date)}
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
                {kpiData && (
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <OtherKpisCard kpi={kpiData} />
                    </Grid>
                    <Grid item>
                      <KpiCard kpi={kpiData} kpiHistory={kpiHistory} />
                    </Grid>
                    <Grid item>
                      <TitrKpiCard kpi={kpiData} kpiHistory={kpiHistory} />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <AnalysisCard date={dateString} />
              </Grid>
            </Grid>
          </>
        )}

        {viewMode === 'week' && (
          <WeekAnalysisCard 
            weekAnalysis={weekAnalysis} 
            isLoading={weekIsLoading} 
            error={weekError} 
          />
        )}
      </Container>
    </>
  );
}

export default App;
