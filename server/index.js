const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/medications', require('./routes/medications'))
app.use('/api/health-metrics', require('./routes/healthMetrics'))
app.use('/api/medical-records', require('./routes/medicalRecords'))
app.use('/api/profile', require('./routes/profile'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.log('DB connection error:', err))
