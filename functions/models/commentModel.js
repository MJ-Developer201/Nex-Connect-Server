const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
})

const CommentModel = mongoose.model('comment', CommentSchema, 'comments')

module.exports = CommentModel
