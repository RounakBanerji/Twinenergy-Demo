import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Trends = ({ history = [] }) => {
  // pick latest 8 entries or fewer, and build arrays
  const entries = (history || []).slice(0, 8).reverse(); // oldest -> newest
  const labels = entries.map(e => new Date(e.date).toLocaleDateString());
  const totals = entries.map(e => {
    const d = e.data || { consumption:0, travel:0, digital:0, finance:0 };
    return d.consumption + d.travel + d.digital + d.finance;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Total weekly footprint (sum of categories)',
        data: totals,
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <>
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Trends</h1>
        <p className="text-gray-500">See how your footprint changes over weeks.</p>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-md">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">Not enough history yet — update your dashboard a few times.</p>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </>
  );
};

export default Trends;
