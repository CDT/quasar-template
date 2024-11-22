<template>
  <div class="row q-col-gutter-md">
    <!-- Table -->
    <div class="col-12 col-md-6">
      <q-scroll-area style="height: 300px;">
        <table class="full-width stat-table" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th class="text-left">科室</th>
              <th class="text-left">性别</th>
              <th class="text-right">人数</th>
              <th class="text-right">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in genderData" :key="index">
              <td v-if="shouldShowDept(index)" :rowspan="getDeptRowSpan(row.dept)">{{ row.dept }}</td>
              <td>{{ row.gender }}</td>
              <td class="text-right">{{ row.count }}</td>
              <td class="text-right">{{ row.percentage }}%</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">合计</td>
              <td class="text-right">{{ totalCount }}</td>
              <td class="text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </q-scroll-area>
    </div>
    <!-- Chart -->
    <div class="col-12 col-md-6" style="height: 300px">
      <canvas ref="ageChartRef"></canvas>
    </div>
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import Chart from 'chart.js/auto'
  
  const ageChartRef = ref<HTMLCanvasElement | null>(null)
  const genderData = ref([
    { dept: '内科', gender: '男', count: 120, percentage: 55.56 },
    { dept: '内科', gender: '女', count: 96, percentage: 44.44 },
    { dept: '外科', gender: '男', count: 85, percentage: 53.13 },
    { dept: '外科', gender: '女', count: 75, percentage: 46.87 },
    { dept: '儿科', gender: '男', count: 45, percentage: 52.33 },
    { dept: '儿科', gender: '女', count: 41, percentage: 47.67 },
    { dept: '妇产科', gender: '男', count: 0, percentage: 0 },
    { dept: '妇产科', gender: '女', count: 88, percentage: 100 },
  ])
  
  const totalCount = computed(() => 
    genderData.value.reduce((sum, item) => sum + item.count, 0)
  )
  
  const shouldShowDept = (index: number): boolean => {
    if (index === 0) return true
    return genderData.value[index].dept !== genderData.value[index - 1].dept
  }
  
  const getDeptRowSpan = (dept: string): number => {
    return genderData.value.filter(row => row.dept === dept).length
  }
  
  const initGenderChart = () => {
    if (!ageChartRef.value) return
  
    new Chart(ageChartRef.value, {
      type: 'pie',
      data: {
        labels: ['男', '女'],
        datasets: [{
          data: [
            genderData.value.reduce((sum, item) => sum + (item.gender === '男' ? item.count : 0), 0),
            genderData.value.reduce((sum, item) => sum + (item.gender === '女' ? item.count : 0), 0)
          ],
          backgroundColor: ['#1976D2', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    })
  }
  
  defineExpose({ initGenderChart })
  </script>
  
    
  
  <style scoped>
  
  canvas {
    min-height: 300px;
  }
  </style>