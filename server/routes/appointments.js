const router = require('express').Router()
const auth = require('../middleware/auth')
const Appointment = require('../models/Appointment')

router.get('/', auth, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1 })
  res.json(appointments)
})

router.post('/', auth, async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user: req.user.id })
    res.status(201).json(appointment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    )
    res.json(appointment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
