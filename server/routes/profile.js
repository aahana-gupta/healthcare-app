const router = require('express').Router()
const auth = require('../middleware/auth')
const Profile = require('../models/Profile')

router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    res.json(profile || {})
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body, user: req.user.id },
      { upsert: true, new: true }
    )
    res.json(profile)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
