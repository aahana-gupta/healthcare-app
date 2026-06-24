const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: { type: String },
  allergies: { type: String },
  emergencyContact: { type: String },
  age: { type: Number },
  height: { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('Profile', profileSchema)
