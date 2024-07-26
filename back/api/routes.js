'use strict';

// 定义API地址和相应的Controller
const authController = require('./auth/controller');

const { authorizeRole } = require('../utils')

module.exports = function(app) {
  // 1. 用户、权限
  app.route('/api/login')
    .post(authController.loginDemo);
  // app.route(authURL + '/user')
  //   .get(authController.getUser);
}
