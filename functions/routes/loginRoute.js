const express = require('express')
const app = express()
const Router = express.Router
const router = Router()
const UsersModel = require('../models/userModel')
const createToken = require('../utilities/createToken.js')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//login route
router.post('/login', (req, res) => {
  console.log(req.body, 'req.body has been received')
  const { email, password } = req.body
  UsersModel.findOne({ email }).then((user) => {
    if (!user) {
      res.status(400).json({ error: 'user does not exist' })
    }
    console.log('Email:Found', user.email)
    console.log('Password:Found', user.password)

    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (isMatch) {
          console.log('Password Match:', isMatch)
          const token = createToken(user._id)

          res.status(200).json({ token })
        } else {
          res.status(401).json({ error: 'invalid credentials' })
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ error: 'An error Occurred' })
      })
  })
})

module.exports = router
