const express = require('express')
const cors = require('cors')

const app = express()

// Enable Cors
app.use(cors())

// Init Middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))

// Define Routes
app.use('/api/players', require('./routes/api/players'))
app.use('/api/leaderboards', require('./routes/api/leaderboards'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
