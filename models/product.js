const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  variant: Number,

  bead: Number,

  title: String,

  description: String,

  images: [String],

  price: Number,

  stock: Number,

  createdOn: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('product', productSchema)
