import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function MiniSparkline({ history = [] }) {
  const { labels, values } = useMemo(() => {
    const last = history.slice(0, 12).reverse();
    const labels = last.map((s, i) => `W${i + 1}`);
    const values = last.map((s) => {
      const total = Object.values(s.data || {}).reduce((a, b) => a + b, 0);
      return Math.round(total * 10);
    });
    return { labels, values };
  }, [history]);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.15)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    elements: { line: { capBezierPoints: true } },
  };

  return (
    <div className="w-full h-10">
      <Line data={data} options={options} />
    </div>
  );
}
