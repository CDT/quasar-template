'use strict'

const { success, fail } = require('../../utils'),
  model = require('./model')


exports.getOptions = async (req, res) => {
 
  const { dict, t_id } = req.query

  if (!dict && !t_id) return fail(res, '缺少dict/t_id参数', 400)

  let dictOptions = []
  try {
    if (dict) {
      // dictOptions = (await model.getDictOptions({ dict })).rows
      const rows = (await model.getDictOptions({ dict })).rows
      // TODO why concat not working
      dictOptions.concat(rows)
    } else {
      /* TODO */
    }
  } catch (e) {
    return fail(res, e.message)
  }

  success(res, dictOptions)
}