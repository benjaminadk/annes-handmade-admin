const mongoose = require('mongoose')
const Admin = mongoose.model('admin')
const Product = mongoose.model('product')
const Sale = mongoose.model('sale')
const Shipping = mongoose.model('shipping')
const User = mongoose.model('user')

module.exports = {
  Admin,
  Product,
  Sale,
  Shipping,
  User
}
