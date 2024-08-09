'use strict'

const { getParam, success, fail } = require('../../utils'),
  md5 = require('md5'),
  jwt = require('jsonwebtoken'),
  authModel = require('./model'),
  bcrypt = require('bcrypt'),
  { TOKEN_KEY, TOKEN_EXPIRATION_TIME } = require('../../config')

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

// 登录demo
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 登录demo
exports.loginDemo = async (req, res) => {
  const users = [
    {
      username: 'test',
      email: 'test@test.com',
      roles: ['doc', 'nurse'],
      password: '$2b$10$7YOx5O6HIweTBpFUDEwbMuTRH9Mi4awatic2aR22N2/XGKbEfhDe2' // 123123
    },
  ];

  try {
    const { username, password, token } = req.body;

    let user;

    if (token) {
      // Login with token
      try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        user = users.find(u => u.username === decoded.username);
        if (!user) {
          return fail(res, '无效Token', 401);
        }
      } catch (error) {
        return fail(res, '无效Token或Token已过期', 401);
      }
    } else if (username && password) {
      // Login with username and password
      user = users.find(u => u.username === username);
      if (!user) {
        return fail(res, '无效用户名', 400);
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return fail(res, '用户名或密码错误', 400);
      }
    } else {
      return fail(res, '请提供用户名和密码或有效Token', 400);
    }

    // Create and sign JWT
    const newToken = jwt.sign(
      { username: user.username, roles: user.roles },
      TOKEN_KEY,
      { expiresIn: TOKEN_EXPIRATION_TIME }
    );

    success(res, { 
      token: newToken,
      user: {
        username: user.username,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    fail(res, new Error(`服务器错误: ${error.message}`));
  }
}

exports.validateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return fail(res, 'token missing', 401)
  }

  try {
    const decoded = jwt.verify(token, TOKEN_KEY)
    req.user = decoded
    success(res, { user: jwt.verify(token, TOKEN_KEY) })
  } catch (error) {
    return fail(res, 'invalid token', 401)
  }
}

exports.getUser = async (req, res) => {
 
  let username = getParam(req, 'username')
  
  let user = (await authModel.findUser({username})).rows[0]

  success(res, user)
}