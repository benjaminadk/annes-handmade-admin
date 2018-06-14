const mongoose = require('mongoose')
const KEYS = require('../config')

const URI = KEYS.MLAB_URI
const callback = err => {
  if (err) return console.error(err)
  console.log('SERVER CONNECTED TO MLAB')
}

mongoose.connect(
  URI,
  callback
)
mongoose.Promise = global.Promise
mongoose.set('debug', true)
