var oracledb = require('oracledb')
const {ORACLE_URI, ORACLE_USER, ORACLE_PASSWORD} = require('./config')
const log4js = require('log4js')

// 日志
logger = log4js.getLogger()
fileLogger = log4js.getLogger('file')

// 初始化Oracle
exports.initOracle = () => {
  let connectionString = ORACLE_URI
  let user = ORACLE_USER
  let password = ORACLE_PASSWORD
  oracledb.createPool({ connectionString, user, password },
    (err, pool) => {
      if (err) console.trace(err)
      logger.info('oracle pool created: ' + connectionString + ' ' + user + '/' + password)
    }
  )
  oracledb.outFormat = oracledb.OBJECT
  process.on('exit', closeOracle)
}

function execute (statement, binds = {}, opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn
    opts.outFormat = oracledb.OBJECT
    opts.autoCommit = true
    logger.debug(`SQL: ${statement}`)
    try {
      conn = await oracledb.getConnection()
      const result = await conn.execute(statement, binds, opts)
      resolve(result)
    } catch (err) {
      console.trace(err)
      console.error('问题SQL: ' + statement)
      reject(err)
    } finally {
      if (conn) {
        try {
          await conn.close()
        } catch (err) {
          console.trace(err)
          reject(err)
        }
      }
    }
  })
}
exports.execute = execute

function trans (statements) {
  return new Promise(async (resolve, reject) => {
    let conn
    
    try {
      conn = await oracledb.getConnection()
      for (let i in statements) {
        logger.debug(`SQL[${i}]: ${statements[i]}`)
        await conn.execute(statements[i], {}, {outFormat: oracledb.OBJECT, autoCommit: false})
      }
    } catch (err) {  
      console.trace(err)
      reject(err)
    } finally {
      if (conn) {
        conn.commit(e => {
          conn.close()
          if (e) reject(e)
          resolve()
        })
      }
    }
  })
}
exports.trans = trans

exports.getPagedResult = (sql, params) => {
  return new Promise(async (resolve, reject) => {
    result_sql = `select * from 
            (select result.*, rownum rnum from
              (${sql}) result
              where rownum <= (:page+1) * :pagesize)
            where rnum > :page * :pagesize`
    total_sql = `select count(1) total from (${sql})`
    let error
    let result = await execute(result_sql, params).catch(err => {error = err; console.trace(err); return reject(err); })
    if (error) return reject(error)
    
    // 查询总数
    delete params.page; delete params.pagesize // 查询总数时，先删除分页参数
    total = await execute(total_sql, params).catch(err => {error = err; console.trace(err); return reject(err); })
    if (error) return reject(error)
    total = total.rows[0].TOTAL 
  
    
    result.total = total
    resolve(result)
  })
}

// close oracle
closeOracle = async function () {
  await oracledb.getPool().close()
  logger.info('oracle closed.')
}
exports.closeOracle = closeOracle