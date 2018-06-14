const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  username: String,

  password: String
})

mongoose.model('admin', adminSchema)
