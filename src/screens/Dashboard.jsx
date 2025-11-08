"use client"

import { useState } from "react"
import FootprintChart from "../components/FootprintChart"
import { LightBulbIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"
import MiniSparkline from "../components/MiniSparkline"

const Dashboard = ({ footprint, setFootprint, history = [] }) => {
  const [form, setForm] = useState(footprint)
  const [normalize, setNormalize] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const apply = (e) => {
    e.preventDefault()
    if (normalize) {
      const sum = Object.values(form).reduce((a, b) => a + b, 0) || 1
      const scaled = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Math.round((v / sum) * 100)]))
      setFootprint(scaled)
      setForm(scaled)
    } else {
      setFootprint(form)
    }
  }

  const total = Object.values(form).reduce((a, b) => a + b, 0)
  const score = Math.round(total * 10)
  const prevTotal = history?.[1]?.data ? Object.values(history[1].data).reduce((a, b) => a + b, 0) : null
  const prevScore = prevTotal != null ? Math.round(prevTotal * 10) : null
  const delta = prevScore != null ? score - prevScore : null

  const entries = Object.entries(form)
  const [topKey, topVal] = entries.reduce((acc, cur) => (cur[1] > acc[1] ? cur : acc), entries[0])
  const tips = {
    consumption: 'Try a "no-buy" week and repair before replacing to cut consumption-impact.',
    travel: "Batch errands, prefer public transit, and consider one car-free day per week.",
    digital: "Enable dark mode, reduce video resolution when possible, and clean cloud files.",
    finance: "Move savings to greener funds and opt for paperless statements.",
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">Dashboard</h1>
        <p className="text-base text-slate-500">Your weekly sustainability snapshot</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 text-white p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium text-emerald-100 mb-2">Your Twinergy Score</p>
          <p className="text-6xl md:text-7xl font-bold mb-4">{score}</p>
          <div className="w-32">
            <MiniSparkline history={history} />
          </div>
        </div>
        {delta != null && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold backdrop-blur-sm ${
              delta >= 0 ? "bg-emerald-500/30 border border-emerald-300/30" : "bg-red-500/30 border border-red-300/30"
            }`}
          >
            {delta >= 0 ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
            <span>
              {delta >= 0 ? "+" : ""}
              {delta} vs last
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 xl:col-span-2 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Weekly Footprint Breakdown</h2>
          <div className="h-[420px] md:h-[520px] xl:h-[560px]">
            <FootprintChart dataObj={form} score={score} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Quick Insights</h3>
            {["consumption", "travel", "digital", "finance"].map((k) => (
              <div key={k} className="mb-5">
                <div className="flex justify-between text-sm capitalize mb-2">
                  <span className="font-medium text-slate-700">{k}</span>
                  <span className="font-semibold text-slate-900">{form[k]}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      k === "consumption"
                        ? "bg-emerald-500"
                        : k === "travel"
                          ? "bg-sky-500"
                          : k === "digital"
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(form[k], 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <LightBulbIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-2">Smart Eco Tip</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Biggest driver is <span className="capitalize font-semibold text-slate-900">{topKey}</span> ({topVal}
                  %). {tips[topKey]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={apply} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 space-y-6 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <input
              id="normalize"
              type="checkbox"
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              checked={normalize}
              onChange={(e) => setNormalize(e.target.checked)}
            />
            <label htmlFor="normalize" className="text-sm font-medium text-slate-700 cursor-pointer">
              Normalize to 100 on Apply
            </label>
          </div>
          <div className="text-sm font-medium text-slate-600">
            Total:{" "}
            <span className={`font-semibold ${total !== 100 ? "text-amber-600" : "text-emerald-600"}`}>{total}%</span>
          </div>
        </div>

        {["consumption", "travel", "digital", "finance"].map((k) => (
          <div key={k} className="">
            <div className="flex justify-between text-sm capitalize mb-3">
              <label className="font-medium text-slate-900">{k}</label>
              <span className="font-semibold text-emerald-600">{form[k]}%</span>
            </div>
            <input
              type="range"
              name={k}
              min="0"
              max="100"
              step="1"
              value={form[k]}
              onChange={handleChange}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        ))}

        <div className="pt-4">
          <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 transform hover:-translate-y-0.5">
            Apply Changes
          </button>
        </div>
      </form>
    </>
  )
}

export default Dashboard
