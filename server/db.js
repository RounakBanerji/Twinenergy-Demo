import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import dotenv from 'dotenv'

dotenv.config()

const DB_PATH = process.env.SQLITE_PATH || path.resolve(process.cwd(), 'data', 'twinenergy.db')
const DB_DIR = path.dirname(DB_PATH)
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)
// Pragmas for better durability and performance trade-offs
try {
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
} catch (_) {}

// Initialize tables
// energy_data mirrors the previous EnergyData model
// audit_logs mirrors the previous AuditLog model

db.exec(`
CREATE TABLE IF NOT EXISTS energy_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sensorId TEXT NOT NULL,
  powerOutput REAL NOT NULL,
  temperature REAL,
  location TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_energy_createdAt ON energy_data(createdAt);
CREATE INDEX IF NOT EXISTS idx_energy_sensorId ON energy_data(sensorId);
CREATE INDEX IF NOT EXISTS idx_energy_location ON energy_data(location);
CREATE INDEX IF NOT EXISTS idx_energy_powerOutput ON energy_data(powerOutput);
CREATE INDEX IF NOT EXISTS idx_energy_temperature ON energy_data(temperature);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  op TEXT NOT NULL,
  duration REAL NOT NULL,
  details TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_createdAt ON audit_logs(createdAt);
CREATE INDEX IF NOT EXISTS idx_audit_op ON audit_logs(op);
`)

export function insertAudit(op, duration, detailsObj) {
  const now = new Date().toISOString()
  const details = detailsObj ? JSON.stringify(detailsObj) : null
  const stmt = db.prepare(`INSERT INTO audit_logs (op, duration, details, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`)
  stmt.run(op, duration, details, now, now)
}

export default db
