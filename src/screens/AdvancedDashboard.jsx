import React, { useState } from "react";
import Papa from "papaparse";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { callGeminiAPI } from "../gemini"; // optional AI feature
import { motion } from "framer-motion";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const AdvancedDashboard = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row) => ({
          Date: row.Date,
          Category: row.Category,
          Activity: row.Activity,
          Amount: parseFloat(row.Amount) || 0,
          CO2_Emission: parseFloat(row.CO2_Emission) || 0,
        }));
        setData(parsed);
        computeSummary(parsed);
      },
    });
  };

  const computeSummary = (records) => {
    if (!records.length) return;
    const total = records.reduce((sum, r) => sum + r.CO2_Emission, 0);
    const categories = {};
    records.forEach((r) => {
      categories[r.Category] = (categories[r.Category] || 0) + r.CO2_Emission;
    });
    const avg = total / records.length;
    const highest = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    setSummary({
      total: total.toFixed(2),
      average: avg.toFixed(2),
      highestCategory: highest ? highest[0] : "N/A",
      categoryBreakdown: categories,
    });
  };

  const askGemini = async () => {
    if (!summary) return;
    setLoading(true);
    const prompt = `
      Analyze this carbon footprint summary:
      Total CO₂: ${summary.total} kg
      Average per record: ${summary.average} kg
      Highest category: ${summary.highestCategory}
      Breakdown: ${JSON.stringify(summary.categoryBreakdown)}
      Suggest 3 personalized sustainability tips. This will be output in an app give only in plain text don't make it look like gemini.
    `;
    try {
      const response = await callGeminiAPI(prompt);
      setAiSummary(response || "No AI response received.");
    } catch (err) {
      setAiSummary("Gemini API Error");
    }
    setLoading(false);
  };

  const chartData =
    summary && {
      labels: Object.keys(summary.categoryBreakdown),
      datasets: [
        {
          label: "CO₂ Emission (kg)",
          data: Object.values(summary.categoryBreakdown),
          backgroundColor: [
            "#4ade80",
            "#60a5fa",
            "#f87171",
            "#facc15",
            "#a78bfa",
            "#fb923c",
          ],
        },
      ],
    };

  const lineData =
    data.length &&
    ({
      labels: data.map((d) => d.Date),
      datasets: [
        {
          label: "Daily CO₂ Emission (kg)",
          data: data.map((d) => d.CO2_Emission),
          borderColor: "#34d399",
          backgroundColor: "rgba(52, 211, 153, 0.3)",
          tension: 0.3,
        },
      ],
    });

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, color: "#334155" },
      },
      tooltip: { enabled: true },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: "#334155" } },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: "#64748b" }, grid: { color: "#e2e8f0" } },
      y: { ticks: { color: "#64748b" }, grid: { color: "#e2e8f0" } },
    },
    elements: { point: { radius: 0 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 px-4 sm:px-6 py-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">🌍</div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Advanced Dashboard</h1>
      </div>

      <motion.div
        className="bg-white/70 backdrop-blur rounded-2xl ring-1 ring-white/60 shadow p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm font-medium text-slate-700">Upload CSV File</div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mt-3 block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer bg-white/60 border border-slate-200 rounded-md px-3 py-2"
        />
      </motion.div>

      {summary && (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <div className="rounded-xl p-4 text-center bg-emerald-50/70 ring-1 ring-emerald-200">
              <p className="text-slate-700 font-semibold">Total CO₂</p>
              <p className="text-xl font-medium">{summary.total} kg</p>
            </div>
            <div className="rounded-xl p-4 text-center bg-sky-50/70 ring-1 ring-sky-200">
              <p className="text-slate-700 font-semibold">Average</p>
              <p className="text-xl font-medium">{summary.average} kg</p>
            </div>
            <div className="rounded-xl p-4 text-center bg-rose-50/70 ring-1 ring-rose-200">
              <p className="text-slate-700 font-semibold">Highest Category</p>
              <p className="text-xl font-medium">{summary.highestCategory}</p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-4 mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="bg-white/70 backdrop-blur rounded-2xl ring-1 ring-white/60 shadow p-4">
              <h3 className="font-semibold mb-2">CO₂ by Category</h3>
              <div className="relative h-64">
                <Pie options={pieOptions} data={chartData} />
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur rounded-2xl ring-1 ring-white/60 shadow p-4">
              <h3 className="font-semibold mb-2">CO₂ Trend</h3>
              <div className="relative h-56">
                <Line options={lineOptions} data={lineData} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/70 backdrop-blur rounded-2xl ring-1 ring-white/60 shadow p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <h3 className="font-semibold mb-2">AI Insights</h3>
            <button
              onClick={askGemini}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 shadow hover:bg-emerald-700 active:scale-[.98] transition"
            >
              {loading ? "Analyzing…" : "Ask Gemini"}
            </button>
            {aiSummary && (
              <div className="mt-3 bg-emerald-50/80 ring-1 ring-emerald-200 rounded p-3 whitespace-pre-line">
                {aiSummary}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdvancedDashboard;
