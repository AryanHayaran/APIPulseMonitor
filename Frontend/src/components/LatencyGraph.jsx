import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LatencyGraph({ latencyData = [] }) {
  // Ensure data is sorted by time (oldest first)
  const sortedData = [...latencyData].sort(
    (a, b) => new Date(a.checked_at) - new Date(b.checked_at)
  );

  // Transform latency data for recharts
  const chartData = sortedData.map((item, index) => ({
    id: index + 1,
    checkedAt: new Date(item.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: item.response_time_ms,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No latency data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="checkedAt"
              label={{ value: 'Time (Checked At)', position: 'insideBottom', offset: -5 }}
              stroke="#666"
              tick={{ fontSize: 12 }}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis
              label={{
                value: 'Latency (ms)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
              stroke="#666"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
              }}
              formatter={(value) => [`${value} ms`, 'Response Time']}
              labelFormatter={(label) => `Checked at: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Response Time (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default LatencyGraph;
