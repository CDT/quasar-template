'use strict'
const { execute } = require('../../database')

exports.getDictOptions = params => execute(
  `select word "value", descr "label"
      from dtchen.dictionary d
    where dict = :dict`, params)


exports.getDepts = params => execute(
  `select word "value", descr "label"
      from dtchen.dictionary d
    where dict = :dict`, params)