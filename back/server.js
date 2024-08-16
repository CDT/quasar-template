var express = require('express'), 
  { init, startServer } = require('./utils'),
  routes = require('./api/routes'),
  { MULTI_SERVER, PORT } = require('./config')

// 初始化Oracle
require('./database').initOracle()

// 创建后台服务器，初始化，配置路由
let app = express()
init(app)
routes(app)

// 启动服务器
startServer(app, PORT, MULTI_SERVER)