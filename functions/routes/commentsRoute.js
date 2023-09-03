const express = require('express')
const Router = express.Router
const router = Router()
const mongoose = require('mongoose')
const CommentModel = require('../models/commentModel.js')

router.get('/comments', (req, res) => {
  CommentModel.find()
    .populate('commenter', { user: 0 })
    .then((commentsData) => {
      res.status(200).json({ commentsData })
    })
    .catch((error) => console.log(error))
})

module.exports = router
