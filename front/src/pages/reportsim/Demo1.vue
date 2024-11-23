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

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { showErrorRespNotification } from 'src/utils/notifications';

const $q = useQuasar()

// Type definitions
interface Cell {
  value: string | number
  type?: 'text' | 'percentage' | 'currency'
  className?: string
  rowSpan?: number
  colSpan?: number
}

interface TableRow {
  isSubtotal?: boolean
  cells: Cell[]
}

interface HeaderCell {
  title: string
  rowSpan?: number
  colSpan?: number
  className?: string
}

// 状态定义
const filters = reactive<{
  year: string
  department: string
}>({
  year: '2024',
  department: '全部'
})

const yearOptions = ['2024', '2023', '2022']
const departmentOptions = ['全部', '销售部', '生产部', '研发部']

// 表格相关数据
const tableHeaders = ref<HeaderCell[][]>([
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

const tableData = ref<TableRow[]>([])
const totalRow = ref<Cell[]>([])

// 格式化单元格数值
const formatCellValue = (cell: Cell): string => {
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
    showErrorRespNotification(error)
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
const exportToExcel = async () => {
  try {
    $q.loading.show({
      message: '正在导出...'
    })

    const exportData = {
      year: filters.year,
      department: filters.department,
      tableData: tableData.value,
      totalRow: totalRow.value
    }

    // Using api instead of fetch
    const response = await api.post('/exportToExcel', exportData, {
      responseType: 'blob' // Important for handling binary data
    })

    // Create download link
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] 
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `报表_${filters.year}_${filters.department}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    $q.loading.hide()
    $q.notify({
      type: 'positive',
      message: '导出成功'
    })
  } catch (error) {
    $q.loading.hide()
    showErrorRespNotification(error)
  }
}

onMounted(() => {
  generateReport()
})
</script>

<style lang="scss" scoped>
// Variables
$border-color: #dcdfe6;
$hover-bg: #f5f7fa;
$dark-border: #4c4c4c;
$dark-bg: #1d1d1d;
$dark-hover: #2d2d2d;

.complex-report {
  width: 100%;
  overflow-x: auto;
}

.report-table {
  &-wrapper {
    overflow-x: auto;
    position: relative;
  }

  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border: 1px solid $border-color;

  th, td {
    padding: 8px;
    text-align: center;
    border: 1px solid $border-color;
  }

  thead {
    th {
      background-color: $hover-bg;
    }

    .fixed-column {
      z-index: 2;
      background-color: $hover-bg;
    }
  }

  tbody tr:hover {
    background-color: $hover-bg;
  }
    
  .fixed-column {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: #ffffff;
  }

  .summary-row {
    background-color: $hover-bg;

    .fixed-column {
      background-color: $hover-bg;
    }
  }

  .total-row {
    font-weight: bold;
    background-color: $hover-bg;
  }
}

// Dark theme
.body--dark {
  .report-table {
    border-color: $dark-border;

    th, td {
      border-color: $dark-border;
    }

    thead {
      th {
        background-color: $dark-hover;
      }

      .fixed-column {
        background-color: $dark-hover;
      }
    }

    tbody tr:hover {
      background-color: $dark-hover;
    }
      
    .fixed-column {
      background-color: $dark-bg;
    }

    .summary-row {
      background-color: $dark-hover;

      .fixed-column {
        background-color: $dark-hover;
      }
    }

    .total-row {
      background-color: $dark-hover;
    }
  }

}
</style>