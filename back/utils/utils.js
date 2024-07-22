const bodyParser = require('body-parser'),
  util = require('util'),
  moment = require('moment'),
  cors = require('cors'),
  jwt = require('jsonwebtoken'),
  { TOKEN_KEY } = require('../config'),
  mailer = require('nodemailer'),
  log4js = require('log4js'),
  logger = log4js.getLogger()

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
    appenders: { out: { type: 'stdout' },
                 file: { type: 'file', filename: 'log/application.log'} },
    categories: { default: { appenders: ['out'], level: 'trace' },
                  file: { appenders: ['out', 'file'], level: 'warn' } }
  })
}

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
