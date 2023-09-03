const functions = require('firebase-functions')
const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const registerRoute = require('./routes/registerRoute')
const loginRoute = require('./routes/loginRoute')
const profileRoute = require('./routes/profileRoute')
const userInfoRoute = require('./routes/userInfo')
const postRoute = require('./routes/postRoute')
const likesRoute = require('./routes/likesRoute')
const friendRoute = require('./routes/friendsRoute')
const commentRoute = require('./routes/commentsRoute')
const mongoDbString = process.env.MONGO_DB
//
mongoose
  .connect(mongoDbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error)
  })

// app.use(cors({ origin: 'https://social-clone-eb38a.firebaseapp.com' }))
app.use(cors({ origin: 'https://nexconnet.com' }))
app.use(express.json())

//
app.use('/', registerRoute)
app.use('/', loginRoute)
app.use('/', profileRoute)
app.use('/', userInfoRoute)
app.use('/', postRoute)
app.use('/', likesRoute)
app.use('/', friendRoute)
app.use('/', commentRoute)

//

exports.app = functions.https.onRequest(app)
