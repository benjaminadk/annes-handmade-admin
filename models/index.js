require('./product')
require('./sale')
require('./shipping')
require('./user')
const mongoose = require('mongoose')
const Product = mongoose.model('product')
const Sale = mongoose.model('sale')
const Shipping = mongoose.model('shipping')
const User = mongoose.model('user')

module.exports = {
  Product,
  Sale,
  Shipping,
  User
}
