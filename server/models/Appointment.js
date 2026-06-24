const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  notes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema)
