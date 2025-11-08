"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  HomeIcon,
  GlobeAltIcon,
  UsersIcon,
  CalculatorIcon,
  UserIcon,
  ChartBarIcon,
  LightBulbIcon,
  MapIcon,
  BoltIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid"

export default function BottomNav({ activeTab, setActiveTab }) {
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const allTabs = [
    { key: "advancedDashboard", label: "Home", icon: HomeIcon },
    { key: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    // { key: "energy", label: "Energy", icon: BoltIcon },
    { key: "logs", label: "Logs", icon: ClipboardDocumentListIcon },
    { key: "coach", label: "Coach", icon: UserIcon },
    { key: "impact", label: "Alternative", icon: GlobeAltIcon },
    { key: "actions", label: "Life-Tips", icon: LightBulbIcon },
    { key: "community", label: "Community", icon: UsersIcon },
    { key: "calculator", label: "Calc", icon: CalculatorIcon },
    { key: "map", label: "Map", icon: MapIcon },
  ]

  const primaryKeys = ["advancedDashboard", "dashboard", "energy", "logs"]
  const primaryTabs = allTabs.filter((t) => primaryKeys.includes(t.key))
  const tabsToShow = isDesktop ? allTabs : primaryTabs

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    // Close menu when switching tabs
    setOpen(false)
  }, [activeTab])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const handler = (e) => setIsDesktop(e.matches)
    setIsDesktop(mq.matches)
    if (mq.addEventListener) mq.addEventListener("change", handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler)
      else mq.removeListener(handler)
    }
  }, [])

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur supports-backdrop-blur:bg-white/60 border-t border-slate-200/70 flex justify-around items-center py-3 shadow-sm px-2">
        {tabsToShow.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ease-out ${
                isActive ? "text-emerald-600 bg-emerald-50/70" : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/70"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium tracking-tight">{tab.label}</span>
            </button>
          )
        })}

        {!isDesktop && (
          <button
            onClick={() => setOpen((v) => !v)}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ease-out ${
              open ? "text-emerald-600 bg-emerald-50/70" : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/70"
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
            <span className="text-xs font-medium tracking-tight">More</span>
          </button>
        )}
      </nav>

      <AnimatePresence>
        {open && !isDesktop && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed bottom-16 left-4 right-4 z-50"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="mx-auto max-w-md bg-white/70 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-3">
                <div className="grid grid-cols-4 gap-2">
                  {allTabs.map((tab, idx) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                      <motion.button
                        key={tab.key}
                        onClick={() => {
                          setActiveTab(tab.key)
                          setOpen(false)
                        }}
                        className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs transition-colors ${
                          isActive ? "text-emerald-700 bg-emerald-50/70" : "text-slate-700 hover:text-slate-900 hover:bg-slate-50/70"
                        }`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.02 * idx }}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="font-medium tracking-tight text-[11px] text-center leading-tight">{tab.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
