const express = require('express')
const router = express.Router()
const config = require('config')
const axios = require('axios')

const API_TOKEN = config.get('API_TOKEN')

const { check, validationResult } = require('express-validator')

// @route   POST api/players
// @des     Get player info and stats by name
// @acess   Public
router.post(
  '/',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('platform', 'Platform is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, platform } = req.body

    const options = {
      headers: {
        accept: 'application/vnd.api+json',
        Authorization: `Bearer ${API_TOKEN}`
      }
    }

    try {
      let endpoint = `https://api.pubg.com/shards/${platform}/players/?filter[playerNames]=${username}`

      const response = await axios.get(endpoint, options)
      const data = response.data.data[0]
      const player_id = data.id

      let endpoint_2 = `https://api.pubg.com/shards/${platform}/players/${player_id}/seasons/lifetime`

      const response_2 = await axios.get(endpoint_2, options)
      const data_2 = response_2.data

      const player = {
        ...data,
        attributes: { ...data.attributes, stats: data_2.data }
      }

      res.json(player)
    } catch (err) {
      return res.status(404).json({ msg: 'Player not Found' })
    }
  }
)

module.exports = router
