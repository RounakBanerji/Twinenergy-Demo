import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    op: { type: String, required: true, index: true },
    duration: { type: Number, required: true },
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', auditLogSchema);
