const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,

  password: String,

  jwt: {
    type: String,
    default: ''
  },

  ships: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'shipping'
  },

  bills: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'billing'
  },

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart'
  },

  createdOn: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('user', userSchema)
