const express = require('express')
const Router = express.Router
const router = Router()
const jwt = require('jsonwebtoken')
const ProfileModel = require('../models/profileModel')
const SECRET_KEY = process.env.SECRET_IDENTIFIER

router.post('/add-friend', (req, res) => {
  const { userId } = req.body
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, '', (err, decoded) => {
    const _id = decoded._id
    ProfileModel.findOne({ user: _id }, { user: 0 })
      .then((user) => {
        if (user.friends.includes(userId)) {
          return res.send('User is already a Friend')
        }
        user.friends.push(userId)
        user
          .save()
          .then((user) => {
            ProfileModel.findOne({ user: _id }, { user: 0 })
              .populate('friends', { user: 0 })
              .then((item) => {
                res.status(201).json({ message: 'Friend Added', item })
                console.log(user, 'Friend Added')
              })
              .catch((error) => console.log(error))
          })
          .catch((error) => console.log(error.message))
      })
      .catch((error) => console.log(error.message))
  })
})

module.exports = router
