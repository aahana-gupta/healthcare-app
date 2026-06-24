const router = require('express').Router()
const auth = require('../middleware/auth')
const Medication = require('../models/Medication')

router.get('/', auth, async (req, res) => {
  const meds = await Medication.find({ user: req.user.id })
  res.json(meds)
})

router.post('/', auth, async (req, res) => {
  try {
    const med = await Medication.create({ ...req.body, user: req.user.id })
    res.status(201).json(med)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id', auth, async (req, res) => {
  try {
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    )
    res.json(med)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Medication.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
