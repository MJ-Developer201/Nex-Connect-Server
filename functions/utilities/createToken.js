const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_IDENTIFIER

function createToken(_id) {
  const token = jwt.sign({ _id }, secretKey)
  return token
}

module.exports = createToken
