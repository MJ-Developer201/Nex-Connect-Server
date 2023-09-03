const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  username: {
    type: String,
  },
  age: {
    type: Number,
  },
  bio: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  website: {
    type: String,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile',
    },
  ],
  picture: {
    type: String,
  },

  post: { type: mongoose.Schema.ObjectId, ref: 'Post' },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
  },
})

const ProfileModel = mongoose.model('profile', ProfileSchema, 'profiles')

module.exports = ProfileModel
