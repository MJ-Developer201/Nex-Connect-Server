const express = require('express')
const app = express()
const Router = express.Router
const router = Router()
const ProfileModel = require('../models/profileModel')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_IDENTIFIER

router.get('/user-info', (req, res) => {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader.split(' ')[1]

  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return console.log('unsuccessful login')
    }
    userId = decoded._id
    ProfileModel.findOne({ user: userId }, { user: 0 })
      .populate('friends', { user: 0 })
      .then((item) => {
        if (!item) {
          res.status(404).json({ error: 'User Profile not found ' })
        } else {
          res.json({ item })
        }
      })
      .catch((error) => {
        console.log('error finding user profile ', error.message)
        res.status(500).json({ error: 'internal service error ' })
      })
  })
})

module.exports = router
