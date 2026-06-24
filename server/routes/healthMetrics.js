const router = require('express').Router()
const auth = require('../middleware/auth')
const HealthMetric = require('../models/HealthMetric')

router.get('/', auth, async (req, res) => {
  const { type } = req.query
  const filter = { user: req.user.id }
  if (type) filter.type = type
  const metrics = await HealthMetric.find(filter).sort({ date: 1 })
  res.json(metrics)
})

router.post('/', auth, async (req, res) => {
  try {
    const metric = await HealthMetric.create({ ...req.body, user: req.user.id })
    res.status(201).json(metric)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await HealthMetric.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
