import { AppBar, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getEntries } from './services/nightscoutService';
import BloodGlucoseChart from './components/BloodGlucoseChart';

function App() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error, isLoading } = useQuery({ 
    queryKey: ['entries', today], 
    queryFn: () => getEntries(today) 
  });

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Nightscout Insight</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard for {today}
        </Typography>
        {isLoading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error.message}</Typography>}
        {data && <BloodGlucoseChart entries={data} />}
      </Container>
    </>
  );
}

export default App;
