const router = require('express').Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const MedicalRecord = require('../models/MedicalRecord')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

router.get('/', auth, async (req, res) => {
  const records = await MedicalRecord.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json(records)
})

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      user: req.user.id,
      title: req.body.title,
      category: req.body.category || 'Other',
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
    })
    res.status(201).json(record)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await MedicalRecord.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
