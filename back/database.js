var oracledb = require('oracledb')
const { DBS } = require('./config')
const log4js = require('log4js')

// 日志
logger = log4js.getLogger()
fileLogger = log4js.getLogger('file')

// 初始化Oracle
exports.initOracle = () => {
  oracledb.initOracleClient() // Enable Thick mode
  DBS.forEach(DB => {
    oracledb.createPool(DB,
      (err, pool) => {
        if (err) console.trace(err)
        logger.info(`oracle pool [${DB.poolAlias}] created: ` + DB.connectionString + ' ' + DB.user + '/' + DB.password)
      }
    )
  })
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
      logger.error('问题SQL: ' + statement, binds)
      reject(err)
    } finally {
      conn && await conn.close()
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

const getPagedResult = (sql, params) => {
  return new Promise(async (resolve, reject) => {
    result_sql = `select * from 
            (select result.*, rownum rnum from
              (${sql}) result
              where rownum <= :page * :pagesize)
            where rnum > (:page - 1) * :pagesize`
    total_sql = `select count(1) total from (${sql})`
      
    try {
      let result = await execute(result_sql, params)
      
      // 查询总数
      // 查询总数前，删除分页参数
      delete params.page
      delete params.pagesize          
      result.total = (await execute(total_sql, params)).rows[0].TOTAL

      // 删除没用的metaData属性
      delete result.metaData

      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}
exports.getPagedResult = getPagedResult

exports.query = (sql, params) => {
  if (params?.page) {
    return getPagedResult(sql, params)
  }
  return execute(sql, params)
}
// close oracle
closeOracle = async function () {
  await oracledb.getPool().close()
  logger.info('oracle closed.')
}
exports.closeOracle = closeOracle