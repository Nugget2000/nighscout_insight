import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Entry } from '../../models/entry';

interface BloodGlucoseChartProps {
  entries: Entry[];
}

const BloodGlucoseChart = ({ entries }: BloodGlucoseChartProps) => {
  const formattedEntries = entries.map(entry => ({
    ...entry,
    date: new Date(entry.date).toLocaleTimeString(),
    mmol: entry.sgv / 18,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedEntries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => value.toFixed(1)} />
        <Tooltip formatter={(value) => [value.toFixed(1), 'mmol/L']} />
        <Legend />
        <Line type="monotone" dataKey="mmol" name="mmol/L" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BloodGlucoseChart;
