'use strict';

// 定义API地址和相应的Controller
const authController = require('./auth/controller')
const miscController = require('./misc/controller')

const { authorizeRole } = require('../utils')

module.exports = function(app) {
  // 1. 用户、权限
  app.post('/api/validate-token', authController.validateToken)
  app.post('/api/login', authController.loginDemo)
  // app.route(authURL + '/user')
  //   .get(authController.getUser);

  
  // 其他
  app.get('/api/options', miscController.getOptions)

  // Add this at the end of all your routes
  app.use('*', (_, res) => {
    res.status(404).json({
      success: false,
      message: 'invalid route'
    })
  })
}
