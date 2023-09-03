const express = require('express')
const mongoose = require('mongoose')
const Router = express.Router
const router = Router()
const PostModel = require('../models/postModel')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_IDENTIFIER

router.post('/main-likes', (req, res) => {
  const { postId } = req.body
  console.log(req.body)
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    const _id = decoded._id
    PostModel.findOne({ _id: postId })
      .then((doc) => {
        doc.likes++
        return doc.save()
      })
      .then((savedDoc) => {
        console.log(savedDoc)
        res.status(201).json({ likes: savedDoc.likes })
      })
      .catch((error) => console.log(error))
  })
})

module.exports = router
