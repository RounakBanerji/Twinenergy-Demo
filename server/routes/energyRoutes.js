import express from 'express';
import db, { insertAudit } from '../db.js';

const router = express.Router();
const now = () => Number(process.hrtime.bigint()) / 1e6;

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

router.post('/energy', async (req, res) => {
  const t0 = now();
  try {
    const { sensorId, powerOutput, temperature = null, location = null } = req.body || {};
    if (!sensorId || powerOutput === undefined || powerOutput === null) {
      return res.status(400).json({ error: 'sensorId and powerOutput are required' });
    }
    const ts = new Date().toISOString();
    const stmt = db.prepare(`INSERT INTO energy_data (sensorId, powerOutput, temperature, location, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(String(sensorId), Number(powerOutput), temperature !== null ? Number(temperature) : null, location ?? null, ts, ts);
    const row = db.prepare(`SELECT * FROM energy_data WHERE id = ?`).get(info.lastInsertRowid);
    insertAudit('CREATE', now() - t0, { id: String(info.lastInsertRowid), body: req.body });
    const created = { _id: String(row.id), sensorId: row.sensorId, powerOutput: row.powerOutput, temperature: row.temperature, location: row.location, createdAt: row.createdAt, updatedAt: row.updatedAt };
    res.status(201).json(created);
  } catch (err) {
    insertAudit('CREATE_ERROR', now() - t0, { error: err.message });
    res.status(400).json({ error: err.message });
  }
});

router.get('/energy', async (req, res) => {
  const t0 = now();
  try {
    const { location, sensorId, minPower, maxPower, minTemp, maxTemp, sortBy = 'createdAt', order = 'desc', page = '1', limit = '20' } = req.query;

    const where = [];
    const params = [];
    if (location) { where.push('location = ?'); params.push(String(location)); }
    if (sensorId) { where.push('sensorId = ?'); params.push(String(sensorId)); }
    const minP = toNum(minPower); const maxP = toNum(maxPower);
    if (minP !== undefined) { where.push('powerOutput >= ?'); params.push(minP); }
    if (maxP !== undefined) { where.push('powerOutput <= ?'); params.push(maxP); }
    const minT = toNum(minTemp); const maxT = toNum(maxTemp);
    if (minT !== undefined) { where.push('temperature >= ?'); params.push(minT); }
    if (maxT !== undefined) { where.push('temperature <= ?'); params.push(maxT); }

    const allowedSort = new Set(['powerOutput', 'temperature', 'createdAt', 'updatedAt', 'sensorId', 'location']);
    const sortField = allowedSort.has(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const dbStart = now();
    const rows = db.prepare(`SELECT * FROM energy_data ${whereSql} ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`).all(...params, limitNum, skip);
    const totalRow = db.prepare(`SELECT COUNT(*) as count FROM energy_data ${whereSql}`).get(...params);
    const dbDuration = now() - dbStart;

    insertAudit('READ_LIST', dbDuration, { query: req.query, count: rows.length, total: totalRow.count });

    const data = rows.map(r => ({ _id: String(r.id), sensorId: r.sensorId, powerOutput: r.powerOutput, temperature: r.temperature, location: r.location, createdAt: r.createdAt, updatedAt: r.updatedAt }));
    res.json({
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: totalRow.count,
        totalPages: Math.ceil(totalRow.count / limitNum),
        sortBy: sortField,
        order: order === 'asc' ? 'asc' : 'desc',
        filters: where,
      },
    });
  } catch (err) {
    insertAudit('READ_LIST_ERROR', now() - t0, { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

router.put('/energy/:id', async (req, res) => {
  const t0 = now();
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    const existing = db.prepare('SELECT * FROM energy_data WHERE id = ?').get(id);
    if (!existing) {
      insertAudit('UPDATE_NOT_FOUND', now() - t0, { id: String(id) });
      return res.status(404).json({ error: 'Not found' });
    }
    const fields = [];
    const values = [];
    const payload = req.body || {};
    if (payload.sensorId !== undefined) { fields.push('sensorId = ?'); values.push(String(payload.sensorId)); }
    if (payload.powerOutput !== undefined) { fields.push('powerOutput = ?'); values.push(Number(payload.powerOutput)); }
    if (payload.temperature !== undefined) { fields.push('temperature = ?'); values.push(payload.temperature === null ? null : Number(payload.temperature)); }
    if (payload.location !== undefined) { fields.push('location = ?'); values.push(payload.location); }
    fields.push('updatedAt = ?'); values.push(new Date().toISOString());
    if (fields.length) {
      db.prepare(`UPDATE energy_data SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    }
    const updated = db.prepare('SELECT * FROM energy_data WHERE id = ?').get(id);
    insertAudit('UPDATE', now() - t0, { id: String(id) });
    res.json({ _id: String(updated.id), sensorId: updated.sensorId, powerOutput: updated.powerOutput, temperature: updated.temperature, location: updated.location, createdAt: updated.createdAt, updatedAt: updated.updatedAt });
  } catch (err) {
    insertAudit('UPDATE_ERROR', now() - t0, { id: req.params.id, error: err.message });
    res.status(400).json({ error: err.message });
  }
});

router.delete('/energy/:id', async (req, res) => {
  const t0 = now();
  try {
    const id = parseInt(req.params.id, 10);
    const row = db.prepare('SELECT id FROM energy_data WHERE id = ?').get(id);
    const duration = now() - t0;
    if (!row) {
      insertAudit('DELETE_NOT_FOUND', duration, { id: String(id) });
      return res.status(404).json({ error: 'Not found' });
    }
    db.prepare('DELETE FROM energy_data WHERE id = ?').run(id);
    insertAudit('DELETE', duration, { id: String(id) });
    res.json({ success: true });
  } catch (err) {
    insertAudit('DELETE_ERROR', now() - t0, { id: req.params.id, error: err.message });
    res.status(400).json({ error: err.message });
  }
});

router.get('/energy/audit/logs', async (_req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY createdAt DESC LIMIT 50').all();
    const parsed = logs.map(l => ({ _id: String(l.id), op: l.op, duration: l.duration, details: l.details ? JSON.parse(l.details) : null, createdAt: l.createdAt, updatedAt: l.updatedAt }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
