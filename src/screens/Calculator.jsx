// src/screens/Calculator.jsx
import React, { useState, useEffect } from "react";
import FootprintChart from "../components/FootprintChart";
import {
  ChartBarIcon,
  BoltIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";

export default function Calculator() {
  const [inputs, setInputs] = useState({
    electricity: "",
    travel: "",
    digital: "",
    spending: "",
  });

  const [metrics, setMetrics] = useState({
    total: 0,
    breakdown: [],
  });

  const CHART_COLORS = ["#059669", "#6D28D9", "#D97706", "#DC2626"];

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    const elec = Number(inputs.electricity) || 0;
    const trav = Number(inputs.travel) || 0;
    const digi = Number(inputs.digital) || 0;
    const spend = Number(inputs.spending) || 0;

    // Conversion factors (kg CO₂)
    const elecCarbon = elec * 0.92;
    const travCarbon = trav * 0.21;
    const digiCarbon = digi * 0.55;
    const spendCarbon = spend * 0.062;

    const total = elecCarbon + travCarbon + digiCarbon + spendCarbon;

    const breakdown = [
      { label: "Electricity", value: elecCarbon },
      { label: "Travel", value: travCarbon },
      { label: "Digital", value: digiCarbon },
      { label: "Spending", value: spendCarbon },
    ].filter((b) => b.value > 0);

    setMetrics({ total, breakdown });
  };

  useEffect(() => {
    calculate();
  }, [inputs]);

  return (
    <div className="space-y-8">
      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-semibold">Carbon Calculator</h1>
        <p className="text-gray-500">Estimate your personal carbon footprint</p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-700">
          <BoltIcon className="w-6 h-6" />
          Input Your Data
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Electricity Usage (kWh)"
            field="electricity"
            value={inputs.electricity}
            onChange={handleInputChange}
          />
          <InputField
            label="Travel Distance (km)"
            field="travel"
            value={inputs.travel}
            onChange={handleInputChange}
          />
          <InputField
            label="Digital Usage (hours/day)"
            field="digital"
            value={inputs.digital}
            onChange={handleInputChange}
          />
          <InputField
            label="Monthly Spending (₹)"
            field="spending"
            value={inputs.spending}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* BREAKDOWN & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* CHART CARD */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100 lg:col-span-2 h-full">
          <h3 className="text-lg font-semibold mb-4">Carbon Breakdown</h3>
          {metrics.breakdown.length > 0 ? (
            <div className="h-[340px] md:h-[420px]">
              <FootprintChart
                data={metrics.breakdown.map((b, i) => ({
                  ...b,
                  color: CHART_COLORS[i],
                }))}
              />
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-400">
              Enter your data to see the breakdown
            </div>
          )}
        </div>

        {/* TOTAL CARD */}
        <div className="bg-white shadow rounded-2xl p-6 border border-gray-100 h-full flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Total Carbon Output</h3>
          <div className="text-4xl font-bold text-emerald-600 whitespace-nowrap tabular-nums">
            {metrics.total.toFixed(2)} kg
          </div>
          <p className="text-gray-500 mt-2">
            Overall footprint based on your inputs
          </p>
        </div>
      </div>
    </div>
  );
}

/* ✅ Reusable input field */
function InputField({ label, field, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="number"
        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-200 outline-none"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder="Enter value"
      />
    </div>
  );
}
