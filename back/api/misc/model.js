'use strict'
const { execute, query } = require('../../database')

exports.getDictOptions = params => execute(
  `select word "value", descr "label"
      from dtchen.dictionary d
    where dict = :dict`, params)


exports.getDepts = params => query(
  `select o.code "code",
          a.area_name_short "area_name",
          o.name "name",
          o.address "address",
          d.word "type",
          d.descr || '(' || d.word || ')' "type_name",
          o.phone "phone",
          (select o1.name || '(' || o1.code || ')'
              from bds.bds_organization o1
            where o1.id = o.parent_id) "parent_org_name"
      from bds.bds_organization o
      left join thbi.v_rpt_area_list a
        on o.property1 = a.area_code
      left join dtchen.dictionary d
        on d.status = '1'
      and d.dict = 'ORG_TYPE'
      and d.word = o.property3
    where 1 = 1
  ${params.keyword ? `and (o.code like :keyword or o.name like :keyword)` : ''}
  ${params.type ? `and o.property3 = :type` : ''}
  order by o.code
`, params)