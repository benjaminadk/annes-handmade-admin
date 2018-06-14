const jwt = require('jsonwebtoken')
const KEYS = require('../config')

const checkAuthHeaders = (req, res, next) => {
  const TOKEN = req.headers.authorization
  jwt.verify(TOKEN, KEYS.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err.message)
    }
    if (user) {
      req.user = user
    }
  })
  next()
}

module.exports = { checkAuthHeaders }
