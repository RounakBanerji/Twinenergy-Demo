import sampleEnergy from '../sample/energy.sample.json';
import sampleLogs from '../sample/logs.sample.json';

const BASE = import.meta.env.VITE_API_BASE || '/api';
const USE_SAMPLE = String(import.meta.env.VITE_USE_SAMPLE || '').toLowerCase() === '1' || String(import.meta.env.VITE_USE_SAMPLE || '').toLowerCase() === 'true';

export async function fetchEnergy(filters) {
  if (USE_SAMPLE) return sampleEnergy;
  try {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${BASE}/energy?${params}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch {
    return sampleEnergy;
  }
}

export async function fetchAuditLogs() {
  if (USE_SAMPLE) return sampleLogs;
  try {
    const res = await fetch(`${BASE}/energy/audit/logs`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch {
    return sampleLogs;
  }
}
