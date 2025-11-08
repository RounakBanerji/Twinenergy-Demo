import { motion } from "framer-motion"

export default function Landing({ setActiveTab }) {
  return (
    <div className="relative md:-mx-8 mb-4 overflow-x-hidden pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-[700px] h-[500px] rounded-full opacity-40 blur-3xl"
             style={{ background: "radial-gradient(closest-side, rgba(0,255,138,0.10), transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[420px] rounded-full opacity-30 blur-3xl"
             style={{ background: "radial-gradient(closest-side, rgba(0,210,122,0.10), transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <nav className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300 text-[#001f0f] flex items-center justify-center font-black shadow-[0_12px_36px_rgba(16,185,129,0.35)]">
              TE
            </div>
            <div>
              <div className="font-extrabold text-emerald-50 leading-tight">TwinEnergy</div>
              <div className="text-xs text-emerald-300/80">Powered by gemini</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex px-4 py-2 rounded-lg border border-white/10 text-emerald-50 hover:bg-white/5 transition"
            >
              Docs
            </a>
            <button
              onClick={() => setActiveTab && setActiveTab("advancedDashboard")}
              className="px-4 py-2 rounded-xl font-extrabold text-[#001f0f] bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_12px_36px_rgba(16,185,129,0.35)] hover:from-emerald-300 hover:to-emerald-200 transition"
            >
              Get Started
            </button>
          </div>
        </nav>

        <section className="flex flex-col lg:flex-row items-center gap-7">
          <div className="flex-1 text-emerald-50">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              Your energy. Measured, explained, optimized.
            </motion.h1>
            <p className="opacity-90 mt-4 max-w-xl text-emerald-100/90">
              TwinEnergy unifies your usage data, advanced filtering, searchable audit logs, and gemini-powered coaching —
              so you can see where energy goes and how to reduce it in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                onClick={() => setActiveTab && setActiveTab("energy")}
                className="w-full sm:w-auto px-4 py-2 rounded-xl font-semibold text-[#001f0f] bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_10px_28px_rgba(16,185,129,0.25)] hover:from-emerald-300 hover:to-emerald-200 transition"
              >
                Explore Data
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab("logs")}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
              >
                View Logs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
              <div className="p-4 rounded-xl bg-white/5 border border-emerald-400/10 shadow-[0_10px_30px_rgba(0,255,138,0.08)]">
                <div className="font-bold">Energy Data Explorer</div>
                <div className="opacity-80 mt-1 text-sm">Filter, sort, and drill into usage with fast pagination.</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-emerald-400/10 shadow-[0_10px_30px_rgba(0,255,138,0.08)]">
                <div className="font-bold">Audit Logs & History</div>
                <div className="opacity-80 mt-1 text-sm">Search by operation, time window, and keywords.</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-emerald-400/10 shadow-[0,10px_30px_rgba(0,255,138,0.08)]">
                <div className="font-bold">AI Coach & Tips</div>
                <div className="opacity-80 mt-1 text-sm">gemini-powered insights for smarter savings.</div>
              </div>
            </div>

            <div className="mt-7 p-4 rounded-xl bg-white/5 border border-emerald-400/10 flex items-center justify-between">
              <div>
                <div className="font-extrabold">Join 5,000+ early users</div>
                <div className="text-xs opacity-80">Be part of the energy revolution.</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 font-bold">Early Access</div>
            </div>
          </div>

          <div className="w-full lg:w-[420px] flex items-center justify-center mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-[320px] h-[480px] sm:w-[360px] sm:h-[540px] rounded-2xl bg-emerald-900/30 border border-emerald-400/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
              <div className="absolute inset-4 rounded-xl bg-gradient-to-b from-emerald-950 to-emerald-900 p-4 flex flex-col gap-3 ring-1 ring-emerald-700/20">
                <div className="flex items-center justify-between text-emerald-50/90">
                  <div className="font-extrabold">TwinEnergy</div>
                  <div className="flex items-center gap-2 text-emerald-300/80">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    Live
                  </div>
                </div>
                <div className="relative h-40 rounded-lg border border-emerald-600/20 overflow-hidden bg-emerald-950">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(16,185,129,.25) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(16,185,129,.25) 0 1px, transparent 1px 32px)",
                    }}
                  />
                  <div className="absolute -inset-24 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(16,185,129,0.10),transparent_60%)] animate-[spin_18s_linear_infinite]" />
                  <motion.svg className="absolute inset-0" viewBox="0 0 400 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="teSpark" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <motion.path
                      d="M0 120 L40 100 L80 110 L120 70 L160 90 L200 60 L240 80 L280 50 L320 65 L360 40 L400 55"
                      stroke="url(#teSpark)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      filter="url(#glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                    />
                  </motion.svg>
                  <div className="absolute top-3 left-3">
                    <div className="relative w-20 h-20">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "conic-gradient(#34d399 62%, rgba(15,118,110,0.35) 62%)" }}
                      />
                      <div className="absolute inset-1.5 rounded-full bg-emerald-950" />
                      <div className="absolute inset-0 rounded-full blur-md opacity-40"
                           style={{ background: "conic-gradient(#34d399 62%, transparent 62%)" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-emerald-200 text-xs font-bold">
                        62%
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] text-emerald-300/80 font-semibold">Power Utilization</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center font-bold text-emerald-50/90 rounded-md p-2 bg-emerald-900/50 ring-1 ring-emerald-700/30">1.42 kWh</div>
                  <div className="text-center font-bold text-emerald-50/90 rounded-md p-2 bg-emerald-900/50 ring-1 ring-emerald-700/30">48% Efficiency</div>
                  <div className="text-center font-bold text-emerald-50/90 rounded-md p-2 bg-emerald-900/50 ring-1 ring-emerald-700/30">+4% Today</div>
                </div>
                <div className="flex gap-2 -mt-1">
                  <div className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-700/30">Eco</div>
                  <div className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-900/50 text-emerald-200 ring-1 ring-emerald-700/30">Boost</div>
                  <div className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-900/50 text-emerald-200 ring-1 ring-emerald-700/30">Schedule</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab && setActiveTab("coach")}
                    className="flex-1 rounded-lg p-2 font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
                  >
                    Open Coach
                  </button>
                  <div className="w-14 rounded-lg bg-emerald-900/50 ring-1 ring-emerald-700/30" />
                </div>
                <div className="mt-auto h-10 rounded-lg border border-emerald-700/20 bg-emerald-900/40 overflow-hidden">
                  <div className="h-full flex items-center text-[11px] text-emerald-200/90 whitespace-nowrap">
                    <motion.div
                      className="px-3"
                      initial={{ x: 0 }}
                      animate={{ x: [0, -240] }}
                      transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                    >
                      Connected: Home Hub • Solar 2.1kW • Grid 0.9kW • Battery 78% • Devices 12 online
                    </motion.div>
                    <motion.div
                      className="px-3"
                      initial={{ x: 0 }}
                      animate={{ x: [0, -240] }}
                      transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                    >
                      Connected: Home Hub • Solar 2.1kW • Grid 0.9kW • Battery 78% • Devices 12 online
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
