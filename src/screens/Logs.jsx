import { useEffect, useMemo, useState } from "react"
import { fetchAuditLogs } from "../api/energyApi"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon, ChevronUpIcon, ClipboardIcon, ArrowPathIcon, PlusCircleIcon, EyeIcon, PencilSquareIcon, TrashIcon, ExclamationCircleIcon, ClockIcon } from "@heroicons/react/24/solid"

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({ op: "", q: "", since: "", until: "" })
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchAuditLogs()
        setLogs(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const ops = useMemo(() => Array.from(new Set(logs.map((l) => l.op))).sort(), [logs])

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const since = filters.since ? new Date(filters.since).getTime() : null
    const until = filters.until ? new Date(filters.until).getTime() : null
    return logs.filter((l) => {
      if (filters.op && l.op !== filters.op) return false
      const t = l.createdAt ? new Date(l.createdAt).getTime() : null
      if (since && t && t < since) return false
      if (until && t && t > until) return false
      if (!q) return true
      const hay = `${l.op} ${l.duration} ${JSON.stringify(l.details || {})}`.toLowerCase()
      return hay.includes(q)
    })
  }, [logs, filters])

  // helpers to enrich display from details
  const extractSource = (details) => {
    if (!details || typeof details !== 'object') return null
    return (
      details.source || details.vendor || details.platform || details.provider || details.site || details.store || null
    )
  }

  const extractEventTime = (details) => {
    if (!details) return null
    const candidates = [
      details.eventTime,
      details.time,
      details.timestamp,
      details.purchasedAt,
      details.purchaseTime,
      details.order?.purchasedAt,
      details.order?.time,
    ].filter(Boolean)
    for (const t of candidates) {
      const d = new Date(t)
      if (!isNaN(d.getTime())) return d.toISOString()
    }
    try {
      const m = JSON.stringify(details).match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/)
      if (m) return new Date(m[0]).toISOString()
    } catch {}
    return null
  }

  const extractTimeline = (details) => {
    if (!details) return null
    const tl = details.timeline
    if (Array.isArray(tl)) return tl
    return null
  }

  const extractReceivedTime = (details) => {
    if (!details) return null
    const candidates = [
      details.receivedAt,
      details.ingestedAt,
      details.fetchedAt,
      details.scrapedAt,
      details.collectedAt,
    ].filter(Boolean)
    for (const t of candidates) {
      const d = new Date(t)
      if (!isNaN(d.getTime())) return d.toISOString()
    }
    return null
  }

  const opStyle = (op) => {
    if (!op) return "bg-slate-100 text-slate-700"
    if (op.includes("ERROR")) return "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
    if (op.startsWith("CREATE")) return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
    if (op.startsWith("READ")) return "bg-sky-100 text-sky-700 ring-1 ring-sky-200"
    if (op.startsWith("UPDATE")) return "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
    if (op.startsWith("DELETE")) return "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
    return "bg-slate-100 text-slate-700"
  }

  const opIcon = (op) => {
    if (!op) return EyeIcon
    if (op.includes('ERROR')) return ExclamationCircleIcon
    if (op.startsWith('CREATE')) return PlusCircleIcon
    if (op.startsWith('READ')) return EyeIcon
    if (op.startsWith('UPDATE')) return PencilSquareIcon
    if (op.startsWith('DELETE')) return TrashIcon
    return EyeIcon
  }

  const opAccent = (op) => {
    if (!op) return { bar: 'from-slate-300 to-transparent', dot: 'bg-slate-400' }
    if (op.includes('ERROR')) return { bar: 'from-rose-400 to-transparent', dot: 'bg-rose-500' }
    if (op.startsWith('CREATE')) return { bar: 'from-emerald-400 to-transparent', dot: 'bg-emerald-500' }
    if (op.startsWith('READ')) return { bar: 'from-sky-400 to-transparent', dot: 'bg-sky-500' }
    if (op.startsWith('UPDATE')) return { bar: 'from-amber-400 to-transparent', dot: 'bg-amber-500' }
    if (op.startsWith('DELETE')) return { bar: 'from-rose-400 to-transparent', dot: 'bg-rose-500' }
    return { bar: 'from-slate-300 to-transparent', dot: 'bg-slate-400' }
  }

  const timeAgo = (iso) => {
    if (!iso) return ''
    const d = new Date(iso).getTime(); if (isNaN(d)) return ''
    const s = Math.floor((Date.now() - d) / 1000)
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s/60); if (m < 60) return `${m}m ago`
    const h = Math.floor(m/60); if (h < 24) return `${h}h ago`
    const days = Math.floor(h/24); return `${days}d ago`
  }

  const groups = useMemo(() => {
    const map = new Map()
    for (const l of filtered) {
      const date = l.createdAt ? new Date(l.createdAt) : null
      const key = date ? date.toISOString().slice(0,10) : 'unknown'
      const label = date ? date.toLocaleDateString() : 'Unknown'
      if (!map.has(key)) map.set(key, { label, items: [] })
      map.get(key).items.push(l)
    }
    return Array.from(map.entries())
      .sort((a,b) => a[0] < b[0] ? 1 : -1)
      .map(([,v]) => v)
  }, [filtered])

  const copyDetails = async (row) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(row.details || {}, null, 2))
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900/5 text-emerald-700 flex items-center justify-center">🧭</div>
          <h2 className="text-xl font-semibold tracking-tight">Audit Logs</h2>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-white/70 backdrop-blur px-3 py-1.5 ring-1 ring-slate-200 text-slate-700 hover:bg-white transition disabled:opacity-60"
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <select className="border rounded px-2 py-2 bg-white/80" value={filters.op} onChange={(e) => setFilters({ ...filters, op: e.target.value })}>
          <option value="">All Ops</option>
          {ops.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
        <input className="border rounded px-3 py-2 md:col-span-2 bg-white/80" placeholder="Search" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input type="date" className="border rounded px-2 py-2 bg-white/80" value={filters.since} onChange={(e) => setFilters({ ...filters, since: e.target.value })} />
        <input type="date" className="border rounded px-2 py-2 bg-white/80" value={filters.until} onChange={(e) => setFilters({ ...filters, until: e.target.value })} />
        <button className="bg-emerald-600 text-white rounded px-3 py-2 hover:bg-emerald-700 transition" onClick={() => setFilters({ op: "", q: "", since: "", until: "" })}>
          Clear
        </button>
      </div>

      {error && <div className="text-rose-600">{error}</div>}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white/60 backdrop-blur ring-1 ring-white/40 h-20" />
          ))}
        </div>
      )}

      {/* List */}
      <AnimatePresence>
        {!loading && groups.reduce((n,g)=>n+g.items.length,0) === 0 && (
          <motion.div
            className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-white/50 p-6 text-slate-600"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            No logs yet. Actions performed in the app will appear here.
          </motion.div>
        )}

        {!loading && groups.map((group, gi) => (
          <motion.div key={group.label + gi} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className="space-y-3">
            <div className="sticky top-0 z-0 py-1">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 px-3 py-1 rounded-full bg-white/60 ring-1 ring-slate-200">
                <ClockIcon className="h-3.5 w-3.5" />
                {group.label}
              </div>
            </div>

            {group.items.map((row, i) => {
          const id = row._id || String(i)
          const isOpen = !!expanded[id]
          const duration = row.duration?.toFixed ? row.duration.toFixed(2) : row.duration
          const eventIso = extractEventTime(row.details)
          const receivedIso = extractReceivedTime(row.details)
          const source = extractSource(row.details)
          const timeline = extractTimeline(row.details)
          const AccentIcon = opIcon(row.op)
          const accent = opAccent(row.op)
          return (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative rounded-2xl bg-white/70 backdrop-blur ring-1 ring-white/50 shadow-sm p-4 overflow-hidden"
            >
              <div className={`pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accent.bar}`} />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] md:text-xs px-2 py-1 rounded-full font-medium ${opStyle(row.op)}`}>{row.op || '—'}</span>
                  <div className="text-xs md:text-sm text-slate-600">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}</div>
                  <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">{timeAgo(eventIso || row.createdAt)}</span>
                  {source && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200">{source}</span>
                  )}
                  {receivedIso && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200">Received {new Date(receivedIso).toLocaleString()}</span>
                  )}
                  {eventIso && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200">Event {new Date(eventIso).toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] md:text-xs px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 ring-1 ring-emerald-200">{duration} ms</span>
                  <span className={`hidden md:inline-flex items-center justify-center h-6 w-6 rounded-lg ${accent.dot} text-white/90`}>
                    <AccentIcon className="h-4 w-4" />
                  </span>
                  <button title="Copy details" onClick={() => copyDetails(row)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                    <ClipboardIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => setExpanded((e) => ({ ...e, [id]: !isOpen }))} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
                    {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="mt-3 space-y-3">
                    {source && (
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Source:</span> {source}
                      </div>
                    )}
                    {eventIso && (
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Event time:</span> {new Date(eventIso).toLocaleString()}
                      </div>
                    )}
                    {receivedIso && (
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Received time:</span> {new Date(receivedIso).toLocaleString()}
                      </div>
                    )}
                    {Array.isArray(timeline) && timeline.length > 0 && (
                      <div className="bg-white/70 rounded-xl ring-1 ring-slate-200/70 p-3">
                        <div className="text-xs font-medium text-slate-700 mb-2">Timeline</div>
                        <div className="space-y-2">
                          {timeline.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
                              <div className="text-[11px] md:text-xs text-slate-700">
                                <div className="font-medium capitalize">{step.label || step.event || 'event'}</div>
                                {step.time && (
                                  <div className="text-slate-500">{new Date(step.time).toLocaleString()}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <pre className="text-[11px] md:text-xs whitespace-pre-wrap break-words bg-slate-50/70 rounded-xl p-3 ring-1 ring-slate-200/70">{JSON.stringify(row.details || {}, null, 2)}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
