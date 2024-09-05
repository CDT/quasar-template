'use strict'

const { success, fail, removeNullProps } = require('../../utils'),
  model = require('./model'),
  { MOCK } = require('../../config'),
  { MOCK_OPTIONS_DATA, MOCK_DEPTS_DATA } = require('../mock_data')


exports.getOptions = async (req, res) => {
 
  const { dict, t_id } = req.query

  if (!dict && !t_id) return fail(res, '缺少dict/t_id参数', 400)

  // MOCK数据
  if (MOCK) return success(res, MOCK_OPTIONS_DATA[dict || t_id])

  let dictOptions = []

  try {
    if (dict) {
      // dictOptions = (await model.getDictOptions({ dict })).rows
      const rows = (await model.getDictOptions({ dict })).rows
      dictOptions.push(...rows)
    } else {
      /* TODO */
    }
  } catch (e) {
    return fail(res, e.message)
  }

  success(res, dictOptions)
}


exports.getDepts = async (req, res) => {
 
  const { keyword, type } = req.query

  // MOCK数据
  if (MOCK) return success(res, MOCK_DEPTS_DATA, { total: 2 })

  try {
    success(res, (await model.getDepts(removeNullProps({ keyword, type })).rows))
  } catch (e) {
    fail(res, e.message)
  }
}