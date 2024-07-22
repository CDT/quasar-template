let axios = require('axios')
let log4js = require('log4js'); logger = log4js.getLogger()

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
