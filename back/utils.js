const bodyParser = require('body-parser'),
  util = require('util'),
  moment = require('moment'),
  cors = require('cors'),
  jwt = require('jsonwebtoken'),
  { TOKEN_KEY } = require('./config'),
  mailer = require('nodemailer'),
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

const whiteList = ["/auth/login"]
const verifyToken = (req, res, next) => {
  if (whiteList.includes(req.path)) return next()
  const token = req.body.token || req.query.token || req.headers["x-access-token"]
  if (!token) {
    return fail(res, "Token required", 403)
  }
  try {
    req.username = jwt.verify(token, TOKEN_KEY)
  } catch (e) {
    return this.fail(res, "Invalid token", 401)
  }
  return next()
}
  
exports.init = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(printLog)
  app.use(cors())
  app.use(verifyToken)

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
        filename: path.join(__dirname, '../log/error.log'),
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


exports.success = (response, data) => {
  response.status(200).json({success: true, data})
}

fail = (response, error, httpErrorCode=500, addon) => {
  console.trace(error)
  response.status(httpErrorCode).json({success: false, message: error.message || error, ...addon})
}
exports.fail = fail

exports.mail = (addrs, title, content) => {
  let transporter = mailer.createTransport({
    host: 'smtp.exmail.qq.com',
    service: 'exmail',
    secure: true,
    auth: {
      user: 'cterm@tjh.tjmu.edu.cn',
      pass: 'e74exJmjGYKQPQza'
    }
  })
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: '"中文医学术语（含中医）系统" <cterm@tjh.tjmu.edu.cn>',
      to: addrs.reduce((prev, curr) => prev + ', ' + curr),
      subject: title,
      text: title,
      html: `<b>${content}</b>`
    }, function(err, msg) {
      if (err) {
        return reject(err)
      } 
      return resolve(msg)
    })
  })
}


// 调用外部API

let base = 'http://192.168.17.223:8080/'
let sqlURL = base + 'sql/query/'
let visitURL = base + 'visits/'

let smsURL = 'http://enscore.tjh.com:21004/ums/sms/transmission'


// 直接传入SQL运行，获得数组格式的运行结果
exports.runSql = sql => axios.get(sqlURL + '?sql=' + encodeURIComponent(sql)).then(resp => resp.data).catch(error => handleError(error, sql))

exports.getVisit = (pid, vnum, source = '2') =>
    axios.get(visitURL + 'search/byPidAndVNum?pid=' + pid + '&vnum=' + vnum + '&projection=simple')
      .then(resp => resp.data._embedded.visits[0]).catch(error => handleError(error))

exports.sms = (Phone, Message) => {
    logger.info(Phone, Message)
    return axios.post(smsURL, {
        User:"YIDUYUN",
        Password:"tongji123456",
        Phone, Message,
        Schedule: ""
    })
}

let handleError = (error, extraMsg = '') => {
    console.error(error.message)
    console.error(extraMsg)
    console.trace()
}

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