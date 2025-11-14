import { useQuery } from '@tanstack/react-query';
import { Container, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useState } from 'react';
import WeekAnalysisCard from '../components/WeekAnalysisCard';
import { WeekAnalysis } from '../models/weekAnalysis';

// This would be replaced with actual API call to your backend
const fetchWeekAnalysis = async (dateStr?: string): Promise<WeekAnalysis> => {
  // Example: http://yourbackend/api/v1/analysis/week?date=2025-11-13
  const queryParam = dateStr ? `?date=${dateStr}` : '';
  const response = await fetch(`/api/v1/analysis/week/${queryParam}`);
  if (!response.ok) {
    throw new Error('Failed to fetch week analysis');
  }
  return response.json();
};

export default function WeekAnalysisPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const { data: weekAnalysis, isLoading, error } = useQuery<WeekAnalysis>({
    queryKey: ['weekAnalysis', selectedDate],
    queryFn: () => fetchWeekAnalysis(selectedDate),
  });

  const handlePreviousWeek = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 7);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 7);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <Button variant="outlined" onClick={handlePreviousWeek}>
          ← Previous Week
        </Button>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <strong>Selected Date: {selectedDate}</strong>
        </Box>
        <Button variant="outlined" onClick={handleNextWeek}>
          Next Week →
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading week analysis: {(error as Error).message}
        </Alert>
      )}

      {weekAnalysis && (
        <WeekAnalysisCard weekAnalysis={weekAnalysis} isLoading={isLoading} error={error} />
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
