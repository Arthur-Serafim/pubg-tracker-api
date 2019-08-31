const express = require('express')
const router = express.Router()
const config = require('config')
const axios = require('axios')
const underscore = require('underscore')

const API_TOKEN = config.get('API_TOKEN')

const { check, validationResult } = require('express-validator')

// @route   POST api/leaderboards
// @des     Get leaderboards
// @acess   Public
router.post(
  '/',
  [
    check('game_mode', 'Game mode is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { game_mode } = req.body

    const options = {
      headers: {
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${API_TOKEN}`
      }
    }

    try {
      let endpoint = `https://api.pubg.com/shards/steam/leaderboards/${game_mode}/?page[1]`

      const response = await axios.get(endpoint, options)
      const data = response.data.included
      res.json(data.sort((a, b) => (a.attributes.rank > b.attributes.rank) ? 1 : -1))
    } catch (err) {
      console.error(err.message)
      res.status(400).json({ msg: 'Server Error' })
    }
  }
)

module.exports = router
