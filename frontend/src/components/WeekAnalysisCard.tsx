import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { WeekAnalysis } from '../models/weekAnalysis';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WeekAnalysisCardProps {
  weekAnalysis?: WeekAnalysis;
  isLoading?: boolean;
  error?: Error | null;
}

const WeekAnalysisCard = ({ weekAnalysis, isLoading, error }: WeekAnalysisCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Error loading week analysis: {error.message}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!weekAnalysis) {
    return null;
  }

  // Prepare data for charts - only days with data
  const chartData = weekAnalysis.daily_analysis
    .filter(day => day.kpis !== null)
    .map(day => ({
      date: day.date.slice(5), // Format as MM-DD
      day: day.day_of_week,
      tir: day.kpis!.tir_percent,
      tar: day.kpis!.tar_percent,
      tbr: day.kpis!.tbr_percent,
      mean_glucose: day.kpis!.mean_glucose,
      cv: day.kpis!.cv,
      titr: day.kpis!.titr_percent,
    }));

  // Calculate weekly averages
  const validDays = weekAnalysis.daily_analysis.filter(day => day.kpis !== null);
  const avgTIR = validDays.length > 0 ? 
    validDays.reduce((sum, day) => sum + day.kpis!.tir_percent, 0) / validDays.length : 0;
  const avgCV = validDays.length > 0 ? 
    validDays.reduce((sum, day) => sum + day.kpis!.cv, 0) / validDays.length : 0;
  const avgMeanGlucose = validDays.length > 0 ? 
    validDays.reduce((sum, day) => sum + day.kpis!.mean_glucose, 0) / validDays.length : 0;

  const getTIRColor = (tir: number) => (tir >= 70 ? '#4caf50' : '#f44336');
  const getCVColor = (cv: number) => (cv <= 25 ? '#4caf50' : '#ff9800');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Weekly Summary Header */}
      <Card>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            Week Analysis ({weekAnalysis.week_start} to {weekAnalysis.week_end})
          </Typography>

          {/* Key Metrics Overview */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Average TIR
                </Typography>
                <Typography variant="h5" sx={{ color: getTIRColor(avgTIR), fontWeight: 'bold' }}>
                  {avgTIR.toFixed(1)}%
                </Typography>
                <Typography variant="caption">Target: ≥70%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Average CV
                </Typography>
                <Typography variant="h5" sx={{ color: getCVColor(avgCV), fontWeight: 'bold' }}>
                  {avgCV.toFixed(1)}%
                </Typography>
                <Typography variant="caption">Lower is better (&lt;25%)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Average Glucose
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {avgMeanGlucose.toFixed(1)} mmol/L
                </Typography>
                <Typography variant="caption">Target: 5.0-10.0 mmol/L</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Days with Data
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {validDays.length}/7
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* TIR Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Time in Range (TIR) - Daily Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                <ReferenceLine y={70} stroke="#4caf50" strokeDasharray="5 5" label="Target 70%" />
                <Bar dataKey="tir" fill="#2196f3" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`tir-${index}`} fill={getTIRColor(entry.tir)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Glucose Range Distribution */}
      {chartData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Time in Ranges - Daily Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="tir" stackId="a" fill="#4caf50" name="Time in Range (70-180 mg/dL)" />
                <Bar dataKey="tar" stackId="a" fill="#ff9800" name="Time Above Range" />
                <Bar dataKey="tbr" stackId="a" fill="#f44336" name="Time Below Range" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Glucose Mean & Variability */}
      {chartData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Mean Glucose & Variability (CV)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" label={{ value: 'Mean Glucose (mmol/L)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'CV (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mean_glucose"
                  stroke="#2196f3"
                  name="Mean Glucose"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cv"
                  stroke="#ff9800"
                  name="CV %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Daily Details Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Daily Details
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>TIR %</strong></TableCell>
                  <TableCell align="right"><strong>Mean</strong></TableCell>
                  <TableCell align="right"><strong>CV %</strong></TableCell>
                  <TableCell align="right"><strong>TITR %</strong></TableCell>
                  <TableCell align="right"><strong>Readings</strong></TableCell>
                  <TableCell align="right"><strong>Treatments</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weekAnalysis.daily_analysis.map((day, index) => (
                  <TableRow key={index} sx={{ backgroundColor: day.kpis ? 'transparent' : '#f9f9f9' }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {day.date.slice(5)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {day.day_of_week}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {day.kpis ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: getTIRColor(day.kpis.tir_percent),
                            }}
                          >
                            {day.kpis.tir_percent.toFixed(1)}%
                          </Typography>
                          <Chip
                            size="small"
                            label={day.kpis.tir_accepted ? 'OK' : 'Low'}
                            color={day.kpis.tir_accepted ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {day.kpis ? `${day.kpis.mean_glucose.toFixed(1)}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {day.kpis ? (
                        <Typography
                          variant="body2"
                          sx={{
                            color: getCVColor(day.kpis.cv),
                            fontWeight: 'bold',
                          }}
                        >
                          {day.kpis.cv.toFixed(1)}%
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {day.kpis ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {day.kpis.titr_percent.toFixed(1)}%
                          </Typography>
                          <Chip
                            size="small"
                            label={day.kpis.titr_accepted ? 'OK' : 'Low'}
                            color={day.kpis.titr_accepted ? 'success' : 'error'}
                            variant="outlined"
                          />
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {day.kpis ? day.kpis.total_readings : day.entries_count}
                    </TableCell>
                    <TableCell align="right">{day.treatments_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {weekAnalysis.daily_analysis.some(day => day.error) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Some days have no data available.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Gemini Analysis */}
      {weekAnalysis.analysis && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Gemini Analysis & Recommendations
            </Typography>
            <Box
              sx={{
                '& h1, & h2, & h3': { mt: 2, mb: 1 },
                '& h1': { fontSize: '1.5rem' },
                '& h2': { fontSize: '1.25rem' },
                '& h3': { fontSize: '1.1rem' },
                '& p': { mb: 1, lineHeight: 1.6 },
                '& ul, & ol': { mb: 1, pl: 2 },
                '& li': { mb: 0.5 },
                '& code': { 
                  backgroundColor: '#f5f5f5',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                },
                '& hr': { my: 2 }
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {weekAnalysis.analysis}
              </ReactMarkdown>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default WeekAnalysisCard;
