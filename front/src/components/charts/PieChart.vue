<template>
  <div class="chart-container">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = ref<ChartData<'pie'>>({
  labels: ['Product A', 'Product B', 'Product C', 'Product D'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10]
    }
  ]
})

const chartOptions = ref<ChartOptions<'pie'>>({
  responsive: true,
  maintainAspectRatio: false
})
</script>

<style scoped>
.chart-container {
  height: 300px;
}
</style>
