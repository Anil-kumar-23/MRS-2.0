const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  times: [{ type: String, required: true }], // Array of time strings like ["08:00", "20:00"]
  frequency: { type: String, enum: ['Daily', 'Weekly', 'As Needed'], default: 'Daily' },
  lastTaken: { type: Date },
  status: { type: String, enum: ['pending', 'taken', 'snoozed'], default: 'pending' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
