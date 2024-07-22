var express = require('express'), 
  { init } = require('./utils/utils'),
  routes = require('./api/routes'),
  defaultPort = 3000

// 初始化数据库
require('./database').initOracle()

// 创建后台服务器，初始化，配置路由
let app = express()
init(app)
routes(app)

let port = process.argv[2] || defaultPort
app.listen(port)

console.log(`Server started on ${port}`)