<!-- ComplexReport.vue -->
<template>
  <div class="complex-report">
    <!-- 报表头部控制区 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.year"
              :options="yearOptions"
              label="年份"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.department"
              :options="departmentOptions"
              label="部门"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn color="primary" @click="generateReport">
              生成报表
            </q-btn>
            <q-btn flat color="secondary" class="q-ml-sm" @click="exportToExcel">
              导出Excel
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 报表主体 -->
    <q-card>
      <q-card-section>
        <div class="report-table-wrapper" ref="tableWrapper">
          <table class="report-table">
            <!-- 多级表头 -->
            <thead>
              <tr v-for="(headerRow, rowIndex) in tableHeaders" :key="rowIndex">
                <th
                  v-for="(header, colIndex) in headerRow"
                  :key="colIndex"
                  :rowspan="header.rowSpan"
                  :colspan="header.colSpan"
                  :class="header.className"
                >
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            
            <!-- 表格主体 -->
            <tbody>
              <template v-for="(row, rowIndex) in tableData" :key="rowIndex">
                <tr :class="{ 'summary-row': row.isSubtotal }">
                  <td
                    v-for="(cell, cellIndex) in row.cells"
                    :key="cellIndex"
                    :rowspan="cell.rowSpan"
                    :colspan="cell.colSpan"
                    :class="cell.className"
                  >
                    {{ formatCellValue(cell) }}
                  </td>
                </tr>
              </template>
            </tbody>

            <!-- 表格底部汇总 -->
            <tfoot>
              <tr class="total-row">
                <td
                  v-for="(cell, index) in totalRow"
                  :key="index"
                  :colspan="cell.colSpan"
                >
                  {{ formatCellValue(cell) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import * as XLSX from 'xlsx'

const $q = useQuasar()

// 状态定义
const filters = reactive({
  year: '2024',
  department: '全部'
})

const yearOptions = ['2024', '2023', '2022']
const departmentOptions = ['全部', '销售部', '生产部', '研发部']

// 表格相关数据
const tableHeaders = ref([
  [
    { title: '部门', rowSpan: 2, colSpan: 1, className: 'fixed-column' },
    { title: '季度', rowSpan: 2, colSpan: 1 },
    { title: '销售情况', colSpan: 3, rowSpan: 1 },
    { title: '成本情况', colSpan: 3, rowSpan: 1 },
    { title: '利润情况', colSpan: 2, rowSpan: 1 }
  ],
  [
    // 第二行表头，由于上面部门和季度已经占用两行，这里跳过
    { title: '销售额', colSpan: 1, rowSpan: 1 },
    { title: '同比增长', colSpan: 1, rowSpan: 1 },
    { title: '完成率', colSpan: 1, rowSpan: 1 },
    { title: '总成本', colSpan: 1, rowSpan: 1 },
    { title: '人工成本', colSpan: 1, rowSpan: 1 },
    { title: '材料成本', colSpan: 1, rowSpan: 1 },
    { title: '毛利率', colSpan: 1, rowSpan: 1 },
    { title: '净利润', colSpan: 1, rowSpan: 1 }
  ]
])

const tableData = ref([])
const totalRow = ref([])

// 格式化单元格数值
const formatCellValue = (cell) => {
  if (!cell.value && cell.value !== 0) return ''
  
  if (cell.type === 'percentage') {
    return `${(cell.value * 100).toFixed(2)}%`
  }
  
  if (cell.type === 'currency') {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(cell.value)
  }
  
  return cell.value
}

// 生成报表数据
const generateReport = async () => {
  try {
    $q.loading.show({
      message: '正在生成报表...'
    })
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成示例数据
    const data = generateSampleData()
    tableData.value = data.rows
    totalRow.value = data.total
    
    $q.loading.hide()
  } catch (error) {
    $q.loading.hide()
    $q.notify({
      type: 'negative',
      message: '生成报表失败：' + error.message
    })
  }
}

// 生成示例数据
const generateSampleData = () => {
  const departments = ['销售部', '生产部', '研发部']
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  
  const rows = []
  let totalSales = 0
  let totalCost = 0
  let totalProfit = 0
  
  departments.forEach(dept => {
    let deptSales = 0
    let deptCost = 0
    let deptProfit = 0
    
    quarters.forEach(quarter => {
      const sales = Math.random() * 1000000
      const cost = sales * 0.7
      const profit = sales - cost
      
      deptSales += sales
      deptCost += cost
      deptProfit += profit
      
      totalSales += sales
      totalCost += cost
      totalProfit += profit
      
      rows.push({
        cells: [
          { value: dept, type: 'text', className: 'fixed-column' },
          { value: quarter, type: 'text' },
          { value: sales, type: 'currency' },
          { value: 0.15, type: 'percentage' },
          { value: 0.85, type: 'percentage' },
          { value: cost, type: 'currency' },
          { value: cost * 0.4, type: 'currency' },
          { value: cost * 0.6, type: 'currency' },
          { value: (sales - cost) / sales, type: 'percentage' },
          { value: profit, type: 'currency' }
        ]
      })
    })
    
    rows.push({
      isSubtotal: true,
      cells: [
        { value: `${dept}小计`, type: 'text', colSpan: 2, className: 'fixed-column' },
        { value: deptSales, type: 'currency' },
        { value: 0.15, type: 'percentage' },
        { value: 0.85, type: 'percentage' },
        { value: deptCost, type: 'currency' },
        { value: deptCost * 0.4, type: 'currency' },
        { value: deptCost * 0.6, type: 'currency' },
        { value: (deptSales - deptCost) / deptSales, type: 'percentage' },
        { value: deptProfit, type: 'currency' }
      ]
    })
  })
  
  const total = [
    { value: '总计', type: 'text', colSpan: 2 },
    { value: totalSales, type: 'currency' },
    { value: 0.15, type: 'percentage' },
    { value: 0.85, type: 'percentage' },
    { value: totalCost, type: 'currency' },
    { value: totalCost * 0.4, type: 'currency' },
    { value: totalCost * 0.6, type: 'currency' },
    { value: (totalSales - totalCost) / totalSales, type: 'percentage' },
    { value: totalProfit, type: 'currency' }
  ]
  
  return {
    rows,
    total
  }
}

// 导出Excel
const exportToExcel = () => {
  try {
    const wb = XLSX.utils.book_new()
    
    // 转换数据格式
    const excelData = [
      // 表头
      ['部门', '季度', '销售额', '同比增长', '完成率', '总成本', '人工成本', 
       '材料成本', '毛利率', '净利润'],
      // 数据行
      ...tableData.value.map(row => 
        row.cells.map(cell => cell.value)
      ),
      // 总计行
      totalRow.value.map(cell => cell.value)
    ]
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(excelData)
    
    // 设置列宽
    const colWidths = [
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
    ws['!cols'] = colWidths

    // 设置单元格样式
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C })
        if (!ws[cell_address]) continue
        
        // 基础样式：Arial字体，边框
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

        // 表头样式
        if (R === 0) {
          ws[cell_address].s.fill = { 
            fgColor: { rgb: "F5F5F5" },
            patternType: 'solid'
          }
          ws[cell_address].s.font.bold = true
        }
        
        // 小计行样式
        const isSubtotalRow = tableData.value[R - 1]?.isSubtotal
        if (isSubtotalRow) {
          ws[cell_address].s.fill = { 
            fgColor: { rgb: "F8F8F8" },
            patternType: 'solid'
          }
        }
        
        // 总计行样式
        if (R === range.e.r) {
          ws[cell_address].s.fill = { 
            fgColor: { rgb: "EEF2FF" },
            patternType: 'solid'
          }
          ws[cell_address].s.font.bold = true
        }
      }
    }
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '报表')
    
    // 导出文件
    XLSX.writeFile(wb, `报表_${filters.year}_${filters.department}.xlsx`)
    
    $q.notify({
      type: 'positive',
      message: '导出成功'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '导出失败：' + error.message
    })
  }
}

// 生命周期钩子
onMounted(() => {
  generateReport()
})
</script>

<style scoped>
.complex-report {
  width: 100%;
  overflow-x: auto;
}

.report-table-wrapper {
  overflow-x: auto;
  position: relative;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.report-table th,
.report-table td {
  border: 1px solid var(--q-border);
  padding: 8px;
  text-align: center;
}

.report-table th {
  background-color: var(--q-table-header-bg);
  font-weight: bold;
}

.fixed-column {
  position: sticky;
  left: 0;
  background-color: var(--q-table-bg);
  z-index: 1;
}

.summary-row {
  background-color: var(--q-table-hover-bg);
}

.total-row {
  background-color: var(--q-primary-fade);
  font-weight: bold;
}

/* 确保固定列的表头始终在最上层 */
thead .fixed-column {
  background-color: var(--q-table-header-bg);
  z-index: 2;
}

:root {
  --q-border: #ddd;
  --q-table-bg: #fff;
  --q-table-header-bg: #f5f5f5;
  --q-table-hover-bg: #f8f8f8;
  --q-primary-fade: #eef2ff;
}

.body--dark {
  --q-border: #404040;
  --q-table-bg: #121212;
  --q-table-header-bg: #1d1d1d;
  --q-table-hover-bg: #242424;
  --q-primary-fade: #1a1a2f;
}
</style>