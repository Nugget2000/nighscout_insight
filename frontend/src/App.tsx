import { AppBar, Button, ButtonGroup, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getEntries } from './services/nightscoutService';
import BloodGlucoseChart from './components/BloodGlucoseChart';
import { useState } from 'react';

function App() {
  const [date, setDate] = useState(new Date());

  const dateString = date.toISOString().slice(0, 10);

  const { data, error, isLoading } = useQuery({ 
    queryKey: ['entries', dateString], 
    queryFn: () => getEntries(dateString) 
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
        {isLoading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error.message}</Typography>}
        {data && <BloodGlucoseChart entries={data} />}
      </Container>
    </>
  );
}

export default App;
