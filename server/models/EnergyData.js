import mongoose from "mongoose";
import AuditLog from "./AuditLog.js";

const energySchema = new mongoose.Schema({
  sensorId: { type: String, required: true, index: true },
  powerOutput: { type: Number, required: true, index: true },
  temperature: Number,
  location: { type: String, index: true },
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

function markStart(next) {
  this.__tStart = process.hrtime.bigint();
  next();
}

async function logDuration(op, ctx, extra = {}) {
  try {
    const end = process.hrtime.bigint();
    const ms = Number(end - (ctx.__tStart || end)) / 1e6;
    await AuditLog.create({
      op: `DB_${op}`,
      duration: ms,
      details: {
        model: 'EnergyData',
        query: typeof ctx.getQuery === 'function' ? ctx.getQuery() : undefined,
        update: typeof ctx.getUpdate === 'function' ? ctx.getUpdate() : undefined,
        ...extra,
      },
    });
  } catch (_) {}
}

// Query middleware
['find', 'findOne', 'countDocuments', 'findOneAndUpdate', 'updateOne', 'deleteOne'].forEach((op) => {
  energySchema.pre(op, markStart);
  energySchema.post(op, function () { logDuration(op.toUpperCase(), this); });
});

// Aggregate middleware
energySchema.pre('aggregate', function (next) { this.__tStart = process.hrtime.bigint(); next(); });
energySchema.post('aggregate', function (res) { logDuration('AGGREGATE', this, { count: Array.isArray(res) ? res.length : undefined }); });

// Save middleware (document)
energySchema.pre('save', function (next) { this.__tStart = process.hrtime.bigint(); next(); });
energySchema.post('save', function () { logDuration('SAVE', this); });

export default mongoose.model("EnergyData", energySchema);
