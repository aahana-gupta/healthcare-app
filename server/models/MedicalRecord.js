const mongoose = require('mongoose')

const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String },
  category: { type: String, default: 'Other' },
}, { timestamps: true })

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema)
