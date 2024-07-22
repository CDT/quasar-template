'use strict';

// 定义API地址和相应的Controller

// 1. 用户、权限
const authURL = '/auth'
const authController = require('./Auth/Controller')

module.exports = function(app) {
  // 1. 用户、权限
  app.route(authURL + '/login')
    .post(authController.login)
  app.route(authURL + '/user')
    .get(authController.getUser)
}
