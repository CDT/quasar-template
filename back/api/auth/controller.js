'use strict'

const { getParam, success, fail } = require('../../utils'),
  md5 = require('md5'),
  jwt = require('jsonwebtoken'),
  authModel = require('./model'),
  bcrypt = require('bcrypt'),
  { TOKEN_KEY, TOKEN_EXPIRATION_TIME } = require('../../config')

// 登录demo
exports.loginDemo = async (req, res) => {
  const users = [
    {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      password: '$2b$10$7YOx5O6HIweTBpFUDEwbMuTRH9Mi4awatic2aR22N2/XGKbEfhDe2' // 123123
    },
  ];

  try {
    const { username, password } = req.body;

    // Find user by email
    const user = users.find(u => u.username === username);
    if (!user) {
      return fail(res, '无效用户名', 400);
    }

    // Check password
    logger.debug(await bcrypt.hash(password, 10))
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return fail(res, '用户名或密码错误', 400);
    }

    // Create and sign JWT
    const token = jwt.sign( { userId: user.id }, TOKEN_KEY, { expiresIn: TOKEN_EXPIRATION_TIME } );

    success(res, { token })
  } catch (error) {
    fail(res, new Error(`服务器错误: ${error.message}`))
  }
}

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