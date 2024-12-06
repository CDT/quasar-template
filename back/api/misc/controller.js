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
 
  const { keyword, type, page, per_page } = req.query

  // MOCK数据
  if (MOCK) return success(res, MOCK_DEPTS_DATA, { total: 2 })

  try {
    const result = (
      await model.getDepts(
        removeNullProps({
          keyword,
          keyword_padded: keyword && '%' + keyword + '%',
          type,
          page: parseInt(page, 10),
          pagesize: parseInt(per_page, 10)
        })
      )
    )

    success(res, result)
  } catch (e) {
    fail(res, e.message)
  }
}

exports.exportToExcel = async (req, res) => {
  const { year, department, tableData, totalRow } = req.body
  const XLSX = require('xlsx')

  try {
    // Create new workbook
    const wb = XLSX.utils.book_new()
    
    // Convert data format
    const excelData = [
      // Headers
      ['部门', '季度', '销售额', '同比增长', '完成率', '总成本', '人工成本', 
       '材料成本', '毛利率', '净利润'],
      // Data rows
      ...tableData.map(row => row.cells.map(cell => cell.value)),
      // Total row
      totalRow.map(cell => cell.value)
    ]
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData)
    
    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // 部门
      { wch: 8 },  // 季度
      { wch: 15 }, // 销售额
      { wch: 12 }, // 同比增长
      { wch: 12 }, // 完成率
      { wch: 15 }, // 总成本
      { wch: 15 }, // 人工成本
      { wch: 15 }, // 材料成本
      { wch: 12 }, // 毛利率
      { wch: 15 }  // 净利润
    ]

    // Apply styles
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C })
        if (!ws[cell_address]) continue
        
        ws[cell_address].s = {
          font: { name: "Arial", sz: 11 },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          },
          alignment: { horizontal: 'center', vertical: 'center' }
        }

        // Header styles
        if (R === 0) {
          ws[cell_address].s.fill = { 
            fgColor: { rgb: "F5F5F5" },
            patternType: 'solid'
          }
          ws[cell_address].s.font.bold = true
        }
        
        // Subtotal styles
        const isSubtotalRow = tableData[R - 1]?.isSubtotal
        if (isSubtotalRow) {
          ws[cell_address].s.fill = { 
            fgColor: { rgb: "F8F8F8" },
            patternType: 'solid'
          }
        }
        
        // Total row styles
        if (R === range.e.r) {
          ws[cell_address].s.fill = { 
            fgColor: { rgb: "EEF2FF" },
            patternType: 'solid'
          }
          ws[cell_address].s.font.bold = true
        }
      }
    }
    
    XLSX.utils.book_append_sheet(wb, ws, '报表')
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=report_${year}_${department}.xlsx`)
    
    // Send buffer
    res.send(buffer)

  } catch (error) {
    // Reset both headers for JSON error response
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', '') // Clear the attachment header
    fail(res, error.message)
  }
}
