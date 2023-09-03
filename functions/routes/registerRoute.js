const express = require('express')
const app = express()
const Router = express.Router
const router = Router()
const UsersModel = require('../models/userModel')
const createToken = require('../utilities/createToken.js')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//register route
router.post('/register', (req, res) => {
  const { email, password } = req.body
  //running authentication
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Must enter a valid email' })
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password is not strong enough' })
  }
  //running verification
  UsersModel.findOne({ email }).then((user) => {
    if (user) {
      res.status(401).json({ error: 'User Already Exist' })
    }
    bcrypt.genSalt(10).then((salt) => {
      bcrypt.hash(password, salt).then((hash) => {
        //saving user to db
        const newUser = new UsersModel({ email, password: hash })
        console.log(email, password)
        return newUser.save().then((user) => {
          const { _id } = user._id
          const token = createToken(_id)
          res.status(201).json({ token })
        })
      })
    })
  })
})

module.exports = router
