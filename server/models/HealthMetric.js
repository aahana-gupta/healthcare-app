const mongoose = require('mongoose')

const healthMetricSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['weight', 'sleep', 'bloodPressure'], required: true },
  value: { type: Number },
  systolic: { type: Number },
  diastolic: { type: Number },
  date: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('HealthMetric', healthMetricSchema)
