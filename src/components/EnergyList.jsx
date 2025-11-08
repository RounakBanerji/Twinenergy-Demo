import { useEffect, useMemo, useState } from 'react';
import { fetchEnergy } from '../api/energyApi';

export default function EnergyList() {
  const [filters, setFilters] = useState({
    location: '',
    minPower: '',
    maxPower: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 20,
  });
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const q = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) q[k] = v;
    });
    return q;
  }, [filters]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchEnergy(query);
      setData(res.data || []);
      setMeta(res.meta || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <input className="border rounded px-2 py-1" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <input type="number" className="border rounded px-2 py-1" placeholder="Min Power" value={filters.minPower} onChange={(e) => setFilters({ ...filters, minPower: e.target.value })} />
        <input type="number" className="border rounded px-2 py-1" placeholder="Max Power" value={filters.maxPower} onChange={(e) => setFilters({ ...filters, maxPower: e.target.value })} />
        <select className="border rounded px-2 py-1" value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="createdAt">Created</option>
          <option value="powerOutput">Power</option>
          <option value="temperature">Temperature</option>
          <option value="sensorId">Sensor</option>
          <option value="location">Location</option>
        </select>
        <select className="border rounded px-2 py-1" value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button className="bg-blue-600 text-white rounded px-3 py-1" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Apply'}
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Sensor</th>
              <th className="text-left p-2">Power</th>
              <th className="text-left p-2">Temp</th>
              <th className="text-left p-2">Location</th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row._id}>
                <td className="p-2 font-mono">{row.sensorId}</td>
                <td className="p-2">{row.powerOutput}</td>
                <td className="p-2">{row.temperature ?? '-'}</td>
                <td className="p-2">{row.location ?? '-'}</td>
                <td className="p-2 text-xs">{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</td>
                <td className="p-2 text-xs">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex items-center gap-3">
          <button
            className="border rounded px-2 py-1"
            onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, Number(f.page) - 1) }))}
            disabled={Number(filters.page) <= 1 || loading}
          >
            Prev
          </button>
          <div>
            Page {meta.page} / {meta.totalPages}
          </div>
          <button
            className="border rounded px-2 py-1"
            onClick={() => setFilters((f) => ({ ...f, page: Number(f.page) + 1 }))}
            disabled={meta.page >= meta.totalPages || loading}
          >
            Next
          </button>
          <select className="border rounded px-2 py-1" value={filters.limit} onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}>
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
