// LineChartComponent.vue
<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ChartData, ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

const chartData = ref<ChartData<'line'>>({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: '#f87979',
      borderColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40]
    }
  ]
})

const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false
})
</script>

<style scoped>
.chart-container {
  height: 300px;
}
</style>
