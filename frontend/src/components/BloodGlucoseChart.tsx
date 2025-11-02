import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Entry } from '../../models/entry';

interface BloodGlucoseChartProps {
  entries: Entry[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#333', padding: '10px', border: '1px solid #666' }}>
        <p>{`Time: ${new Date(data.date_date).toLocaleTimeString()}`}</p>
        <p>{`mmol/L: ${data.mmol.toFixed(1)}`}</p>
        <p>{`SGV: ${data.sgv}`}</p>
        <p>{`Trend: ${data.trend}`}</p>
        <p>{`Direction: ${data.direction}`}</p>
        <p>{`Device: ${data.device}`}</p>
        <p>{`SysTime: ${data.sysTime}`}</p>
        <p>{`Date String: ${data.dateString}`}</p>
        <p>{`Date Date: ${data.date_date}`}</p>
        <p>{`Cached At: ${data.cached_at}`}</p>
      </div>
    );
  }

  return null;
};

const BloodGlucoseChart = ({ entries }: BloodGlucoseChartProps) => {
  if (entries.length === 0) {
    return null;
  }

  const firstEntryDate = new Date(entries[0].date_date);
  const startOfDay = new Date(firstEntryDate).setHours(0, 0, 0, 0);
  const endOfDay = new Date(firstEntryDate).setHours(23, 59, 59, 999);

  const ticks = [];
  for (let i = 0; i <= 24; i += 2) {
    ticks.push(new Date(startOfDay).setHours(i));
  }

  const formattedEntries = entries.map(entry => ({
    ...entry,
    date: new Date(entry.date_date).getTime(), // use timestamp for x-axis
    mmol: entry.sgv ? entry.sgv / 18 : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedEntries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={[startOfDay, endOfDay]}
          ticks={ticks}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />
        <YAxis domain={[2.5, 14]} tickFormatter={(value) => value.toFixed(1)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="mmol" name="mmol/L" stroke="#8884d8" activeDot={{ r: 8 }} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BloodGlucoseChart;
