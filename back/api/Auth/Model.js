'use strict'
const { execute } = require('../../database')

exports.findUser = (params) => execute(
  `select * from uum.uum_user u where 1=1
  ${params.username ? ` and user_name = :username ` : ''}
  ${params.password ? ` and user_password = :password ` : ''}`, params)