'use strict'

const { getParam, success, fail } = require('../../utils'), md5 = require('md5'), jwt = require('jsonwebtoken')
const authModel = require('./Model'), { TOKEN_KEY, TOKEN_EXPIRATION_TIME } = require('../../config')

// 登录demo
exports.loginDemo = async (req, res) => {
  const users = [
    {
      id: 1,
      email: 'user@example.com',
      password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqDOMk9jlsPRS', // 'password123'
    },
  ];

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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