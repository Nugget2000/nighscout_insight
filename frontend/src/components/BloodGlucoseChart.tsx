import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Entry } from '../../models/entry';

interface BloodGlucoseChartProps {
  entries: Entry[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#333', padding: '10px', border: '1px solid #666' }}>
        <p>{`Time: ${new Date(data.date).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}`}</p>
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

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date_date + 'Z').getTime() - new Date(b.date_date + 'Z').getTime());

  const firstEntryDate = new Date(sortedEntries[0].date_date + 'Z');
  const startOfDay = new Date(firstEntryDate.getUTCFullYear(), firstEntryDate.getUTCMonth(), firstEntryDate.getUTCDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

  const ticks = [];
  for (let i = 0; i <= 24; i += 2) {
    ticks.push(startOfDay + i * 2 * 60 * 60 * 1000);
  }

  const formattedEntries = sortedEntries.map(entry => ({
    ...entry,
    date: new Date(entry.date_date + 'Z').getTime(), // use timestamp for x-axis
    mmol: entry.sgv ? entry.sgv / 18 : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedEntries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          domain={[startOfDay, endOfDay]}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}
        />
        <YAxis domain={[2.5, 14]} tickFormatter={(value) => value.toFixed(1)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceArea y1={4.0} y2={8.0} fill="rgba(0, 128, 0, 0.3)" />
        <Line type="monotone" dataKey="mmol" name="mmol/L" stroke="#8583afff" activeDot={{ r: 8  }} connectNulls dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BloodGlucoseChart;
