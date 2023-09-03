const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
  username: {
    type: String,
    ref: 'profile',
  },
  picture: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  post: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const PostModel = mongoose.model('post', PostSchema)

module.exports = PostModel
