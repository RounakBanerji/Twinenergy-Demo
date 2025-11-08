"use client"

import { useEffect, useState } from "react"
import BottomNav from "./components/BottomNav"
import Dashboard from "./screens/Dashboard"
import Impact from "./screens/Impact"
import Actions from "./screens/Actions"
import Community from "./screens/Community"
import Profile from "./screens/Profile"
import Calculator from "./screens/Calculator"
import Coach from "./screens/Coach"
import Trends from "./screens/Trends"
import MapScreen from "./screens/MapScreen"
import AdvancedDashboard from "./screens/AdvancedDashboard"
import { AnimatePresence, motion } from "framer-motion"
import { loadData, saveData } from "./utils/storage"
import Energy from "./screens/Energy"
import Logs from "./screens/Logs"
import Landing from "./screens/Landing"

const screens = {
  landing: Landing,
  dashboard: Dashboard,
  impact: Impact,
  actions: Actions,
  community: Community,
  profile: Profile,
  calculator: Calculator,
  coach: Coach,
  trends: Trends,
  map: MapScreen,
  advancedDashboard: AdvancedDashboard,
  energy: Energy,
  logs: Logs,
}

export default function App() {
  const [activeTab, setActiveTab] = useState("landing")

  // global footprint state
  const [footprint, setFootprint] = useState({
    consumption: 40,
    travel: 25,
    digital: 20,
    finance: 15,
  })

  // weekly history for trends (array of 4 objects)
  const [history, setHistory] = useState(() => loadData("footprintHistory") || [])

  useEffect(() => {
    const saved = loadData("userFootprint")
    if (saved) setFootprint(saved)
  }, [])

  useEffect(() => {
    saveData("userFootprint", footprint)
    // push weekly snapshot to history (simple heuristic: push when footprint changes)
    setHistory((prev) => {
      const snapshot = { date: new Date().toISOString(), data: footprint }
      const next = [snapshot, ...prev].slice(0, 12) // keep up to 12 entries (weeks)
      saveData("footprintHistory", next)
      return next
    })
  }, [footprint])

  const ActiveScreen = screens[activeTab]
  const isLanding = activeTab === "landing"

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
      {!isLanding && (
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-5 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">TwinEnergy</h1>
            </div>
            <p className="text-sm text-emerald-100 hidden md:block">Track. Reduce. Impact.</p>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto w-full px-4 md:px-8 py-8 pb-[64px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <ActiveScreen footprint={footprint} setFootprint={setFootprint} history={history} setHistory={setHistory} setActiveTab={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="container mx-auto flex justify-center">
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </footer>
    </div>
  )
}
