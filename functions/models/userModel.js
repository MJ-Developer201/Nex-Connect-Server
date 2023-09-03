const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

const UsersModel = mongoose.model('user', userSchema, 'users')

module.exports = UsersModel
