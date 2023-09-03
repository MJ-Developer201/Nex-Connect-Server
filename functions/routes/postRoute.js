const express = require('express')
const Router = express.Router
const router = Router()
const ProfileModel = require('../models/profileModel')
const jwt = require('jsonwebtoken')
const PostModel = require('../models/postModel')
const CommentModel = require('../models/commentModel')
const SECRET_KEY = process.env.SECRET_IDENTIFIER

//profile pic

//profile pic
router.post('/post', (req, res) => {
  console.log(req)
  const { postInput, profileId } = req.body

  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    const _id = decoded._id
    ProfileModel.findOne({ user: _id })
      .then((user) => {
        if (!user) {
          return console.log('Could not locate document')
        } else {
          console.log(user.username, 'this is the username log ')
          console.log(user.picture, 'this is the picture log ')
          const newPost = new PostModel({
            user: _id,
            userProfile: profileId,
            username: user.username,
            picture: user.picture,
            post: postInput,
          })
          return newPost
            .save()
            .then((savedPost) => {
              console.log('Saved post = ', savedPost)
              PostModel.find({}, { user: 0 })
                .sort({ createdAt: -1 })
                .limit(10)
                .then((posts) => {
                  res.status(201).json(posts)
                })
            })
            .catch((error) => {
              console.log(error.message, 'Post was not added to Db')
              res.status(500).json({ message: 'Error Creating Post' })
            })
        }
      })
      .catch((error) => {
        console.log(error.message, 'error no User Doc ,Post was not added to Db')
      })
  })
})

router.get('/post', (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    const _id = decoded._id

    PostModel.find({ user: _id })
      .populate('post')
      .sort({ createdAt: -1 })
      .then((post) => {
        if (!post) {
          return console.log('could not locate profile')
        } else {
          res.status(200).json(post)
        }
      })
      .catch((error) => {
        console.log(error.message)
        res.status(500).json({ message: 'Error retrieving Posts' })
      })
  })
})

router.delete('/post', (req, res) => {
  const { postId } = req.body

  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    const _id = decoded._id
    PostModel.deleteOne({ user: _id, _id: postId })
      .then((status) => {
        console.log(status)
        res.status(201).json({ status })
      })
      .catch((error) => console.log(error))
  })
})

router.get('/main-feed', (req, res) => {
  PostModel.find({}, { user: 0 })
    // .populate('userProfile', { user: 0, _id: 0 })
    .limit(10)
    .sort({ createdAt: -1 })

    .then((posts) => {
      res.status(201).json(posts)
    })
    .catch((error) => {
      res.status(400).json({ error: 'Could not retrieve data' })
    })
})

//post comment route
router.post('/add-comment', (req, res) => {
  const { postId, comment, profileId } = req.body
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    //create new comment docu
    const newComment = new CommentModel({
      post: postId,
      commenter: profileId,
      content: comment,
    })
    newComment
      .save()
      .then((comment) => {
        console.log(comment, 'saved comment first comment console log')
        PostModel.findOne({ _id: postId })
          .then((post) => {
            post.comments.push(comment._id)
            post
              .save()
              .then((updatedPost) => {
                updatedPost
                  .populate({ path: 'comments', populate: { path: 'commenter' } })
                  .then((updatedPost) => {
                    console.log(updatedPost)
                    res.status(200).json({ updatedPost })
                  })
              })
              .catch((error) => console.log(error.message))
          })
          .catch((error) => console.log(error.message))
      })
      .catch((error) => console.log(error))
  })
})

module.exports = router
