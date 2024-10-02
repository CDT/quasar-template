<template>
<q-page padding>

  <!-- Four stat cards-->
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6 col-lg-3" v-for="(datum, i) in cardData" :key="i">
      <stat-card :title="datum.title" :content="datum.content"
       :icon="datum.icon" :caption="datum.caption" :icon_color="datum.icon_color" />
    </div>
  </div>

  <div class="row q-col-gutter-md q-mt-md">
    <div class="col-12 col-lg-8">
      <recent-activities :recentActivities="recentActivities" />
    </div>
    <div class="col-12 col-lg-4">
      <quick-actions />
    </div>
  </div>
</q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatCard from 'src/components/dashboard/StatCard.vue'
import RecentActivities from 'src/components/dashboard/RecentActivities.vue'
import QuickActions from 'src/components/dashboard/QuickActions.vue'

const icon_colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1']
const cardData = [
  { title: 'Total Users', content: '10', icon: 'person', caption: 'total number of users', icon_color: icon_colors[0] },
  { title: 'Total Sales', content: '5', icon: 'shopping_cart', caption: 'total number of sales', icon_color: icon_colors[1] },
  { title: 'Total Projects', content: '3', icon: 'work', caption: 'total number of projects', icon_color: icon_colors[2] },
  { title: 'Total Revenue', content: '$500', icon: 'attach_money', caption: 'total amount of revenue', icon_color: icon_colors[3] }
]

const recentActivities = ref([
  { icon: 'person_add', color: 'positive', text: 'New user registered', time: '5 minutes ago' },
  { icon: 'attach_money', color: 'primary', text: 'New sale recorded', time: '30 minutes ago' },
  { icon: 'update', color: 'secondary', text: 'Project status updated', time: '1 hour ago' },
  { icon: 'error', color: 'negative', text: 'System alert received', time: '2 hours ago' },
])
</script>
