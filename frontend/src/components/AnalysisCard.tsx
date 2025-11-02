import { Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAnalysis } from '../services/nightscoutService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisCardProps {
  date: string;
}

const AnalysisCard = ({ date }: AnalysisCardProps) => {
  const { data, error, isLoading } = useQuery<{ analysis: string }>({ 
    queryKey: ['analysis', date], 
    queryFn: () => getAnalysis(date) 
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Gemini Analysis
        </Typography>
        {isLoading && <CircularProgress />}
        {error && <Typography>Error: {error.message}</Typography>}
        {data && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.analysis}
          </ReactMarkdown>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
