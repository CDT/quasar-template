'use strict'

const { getParam, success, fail } = require('../../utils/utils'), md5 = require('md5'), jwt = require('jsonwebtoken')
const authModel = require('./Model'), { TOKEN_KEY, TOKEN_EXPIRATION_TIME } = require('../../config')

// 登录
exports.login = async (req, res) => {
 
  let username = getParam(req, 'username')
  let password = getParam(req, 'password')

  if (!username) return fail(res, 'missing param username', 400)
  if (!password) return fail(res, 'missing param password', 400)
  
  let user = (await authModel.findUser({username, password: md5(password)})).rows[0]
  if (user) {
    user.token = jwt.sign({username: user.user_name}, TOKEN_KEY, { expiresIn: TOKEN_EXPIRATION_TIME } )
    success(res, user)
  } else {
    fail(res, 'Invalid credentials', 401)
  }

}

exports.getUser = async (req, res) => {
 
  let username = getParam(req, 'username')
  
  let user = (await authModel.findUser({username})).rows[0]

  success(res, user)
}