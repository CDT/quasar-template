const bodyParser = require('body-parser'),
  util = require('util'),
  moment = require('moment'),
  cors = require('cors'),
  jwt = require('jsonwebtoken'),
  { TOKEN_KEY } = require('./config'),
  log4js = require('log4js'),
  path = require('path')

const printLog = (req, res, next) => {
  logger.info(`${formatTime(new Date())} 访问：${req.originalUrl}   方法：${ req.method }`)  
  logger.info(`参数：
        post(body):   ${(util.inspect(req.body, false, null))}
        get(query):   ${(util.inspect(req.query, false, null))} )
        path(params): ${(util.inspect(req.params, false, null))} )`)
  next()
}
  
exports.init = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(printLog)
  app.use(cors())
  
  initLoggers()
}

const initLoggers = () => {
  log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      debug: {
        type: 'dateFile',
        filename: path.join(__dirname, 'log/debug.log'),
        pattern: 'yyyy-MM-dd',
        numBackups: 10
      },
      error: {
        type: 'dateFile',
        filename: path.join(__dirname, 'log/error.log'),
        pattern: 'yyyy-MM-dd',
        numBackups: 10
      },
      errorFilter: {
        type: 'logLevelFilter',
        appender: 'error',
        level: 'error'
      }
    },
    categories: {
      default: { appenders: ['out', 'debug', 'errorFilter'], level: "debug" }
    }
  });
}
const logger = log4js.getLogger()
logger.level = 'debug'
exports.logger = logger

const formatTime = time => moment(time).format('YYYY年MM月DD日 HH:mm:ss')
exports.formatTime = formatTime

exports.formatDate = date => moment(date).format('YYYY年MM月DD日')

exports.daysBetween = (date1, date2) => {
  return moment(date2).startOf('day').diff(moment(date1).startOf('day'), 'days')
}

getParam = (req, paramName) => req.query[paramName] || req.params[paramName] || req.body[paramName]
exports.getParam = getParam


exports.success = (response, data, additionalData) => {
  response.status(200).json({success: true, data, ...additionalData})
}

fail = (response, error, httpErrorCode=500, addon) => {
  logger.error(error)
  response.status(httpErrorCode).json({success: false, message: error.message || error, ...addon})
}
exports.fail = fail

exports.startServer = function (app, port, is_multi_server) {
  if (is_multi_server) {
    const numCPUs = require('os').cpus().length
    const cluster = require('cluster')
    if (cluster.isMaster) {
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
      }
      cluster.on('exit', function(worker, code, signal) {
        logger.debug(`worker process ${worker.process.pid} died`)
      })
    } else {
      app.listen(port)
      logger.debug(`server (pid ${process.pid}) started on port ${port}`)
    }
  } else {
    app.listen(port)
    logger.debug(`server started on port ${port}`)
  }
}

exports.authorizeRole = (allowedRoles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
    
  if (!token) {
    return fail(res, new Error('缺失token'), 401)
  }
  
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    if (!allowedRoles.includes(decoded.role)) {
      return fail(res, '无权限', 401);
    }
    req.user = decoded;
    next();
  } catch (error) {
    return fail(res, '非法token', 401);
  }
}


// 删除对象中的空属性
exports.removeNullProps = o => {
  for (let p in o) {
    if (o[p] === null || o[p] === undefined || o[p] === NaN || o[p] === '') delete o[p]
  }
  return o
}