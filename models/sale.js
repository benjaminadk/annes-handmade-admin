const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema({
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'product'
  },

  quantity: [Number],

  total: Number,

  stripeId: String,

  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shipping'
  },

  shipped: {
    type: Boolean,
    default: false
  },

  createdOn: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('sale', saleSchema)
