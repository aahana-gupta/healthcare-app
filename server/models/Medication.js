const mongoose = require('mongoose')

const medicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  morning: { type: Boolean, default: false },
  afternoon: { type: Boolean, default: false },
  night: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Medication', medicationSchema)
