const express = require('express')
const app = express()
const Router = express.Router
const router = Router()
const ProfileModel = require('../models/profileModel')
const UsersModel = require('../models/profileModel')
const createToken = require('../utilities/createToken.js')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { route } = require('./friendsRoute')
const SECRET_KEY = process.env.SECRET_IDENTIFIER
//

//
router.post('/profile-pic', (req, res) => {
  const { url } = req.body
  const authHeader = req.headers.authorization
  console.log(authHeader)
  const token = authHeader.split(' ')[1]
  console.log(token)
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      console.log('JWT verification error:', error.message)
    }
    const _id = decoded._id
    ProfileModel.findOne({ user: _id }, { user: 0 })
      .then((profileFound) => {
        if (!profileFound) {
          return res.status(404).json({ message: 'profile not found' })
        }
        profileFound.picture = url
        return profileFound.save()
      })
      .then((profile) => {
        console.log(profile, 'Profile picture saved successfully')
        res.status(202).json(profile)
      })
      .catch((error) => {
        console.log('error', error.message)
        res.status(500).json({ message: 'an error occurred while updating profile picture' })
      })
  })
})

router.post('/profile', (req, res) => {
  const { username, age, bio, website, state, city } = req.body
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    const _id = decoded._id
    // const newProfile = new ProfileModel({ username, user: _id })
    ProfileModel.findOne({ username })
      .then((profile) => {
        if (!profile) {
          const newProfile = new ProfileModel({ username, age, bio, website, city, state, user: _id })
          newProfile.save().then((savedProfile) => {
            console.log(savedProfile)
            res.status(201).json(savedProfile)
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ error: 'Failed to save to Profile ' })
      })
  })
})

//adding get route to my profile model
router.get('/profile-data-model', (req, res) => {
  ProfileModel.find({}, { user: 0, _id: 0 }).then((profiles) => {
    res.status(200).json({ profiles })
  })
})

//getting single profile
router.get('/single-profile', (req, res) => {
  //take in token from header
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    const _id = decoded._id
    //decode and verify user jwt
    ProfileModel.findOne({ user: _id }, { user: 0 })
      .populate('friends')
      .then((profile) => {
        res.status(200).json({ profile })
      })
      .catch((error) => console.log(error, 'could not find profile'))
  })
})

//route to get other user profileData from button
router.post('/other-profile', (req, res) => {
  const { profile } = req.body

  ProfileModel.findOne({ _id: profile }, { user: 0 })
    .then((profile) => {
      if (!profile) {
        return console.log('profile not found'), res.status(400).json({ message: 'profile not found' })
      }
      res.status(201).json(profile)
    })
    .catch((error) => console.log(error.message))
})

router.post('/target-user', (req, res) => {
  const { targetId } = req.body
  console.log(targetId)
  ProfileModel.findOne({ _id: targetId }, { user: 0 })
    .then((profile) => {
      if (!profile) {
        return console.log('profile not found'), res.status(400).json({ message: 'profile not found' })
      }
      res.status(201).json(profile)
      console.log(profile)
    })
    .catch((error) => console.log(error.message))
})

module.exports = router
