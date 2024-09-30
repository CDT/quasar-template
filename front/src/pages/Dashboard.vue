<template>
<q-page padding>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6 col-lg-3" v-for="(datum, i) in cardData" :key="i">
      <stat-card :title="datum.title" :content="datum.content" :icon="datum.icon" :caption="datum.caption" />
    </div>
  </div>

  <div class="row q-col-gutter-md q-mt-md">
    <div class="col-12 col-lg-8">
      <q-card>
        <q-card-section>
          <div class="text-h6">Recent Activity</div>
          <q-list>
            <q-item v-for="(activity, index) in recentActivities" :key="index">
              <q-item-section avatar>
                <q-icon :name="activity.icon" :color="activity.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ activity.text }}</q-item-label>
                <q-item-label caption>{{ activity.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-lg-4">
      <q-card>
        <q-card-section>
          <div class="text-h6">Quick Actions</div>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="add" color="primary" />
              </q-item-section>
              <q-item-section>New Project</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="mail" color="secondary" />
              </q-item-section>
              <q-item-section>Send Message</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="backup" color="warning" />
              </q-item-section>
              <q-item-section>Backup Data</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatCard from 'src/components/StatCard.vue'

const leftDrawerOpen = ref(false)
const cardData = [
  { title: 'Total Users', content: '10', icon: 'warning', caption: 'test11111' },
  { title: 'Total Sales', content: '5', icon: 'warning', caption: 'test11111' },
  { title: 'Total Projects', content: '3', icon: 'warning', caption: 'test11111' },
  { title: 'Total Revenue', content: '$500', icon: 'warning', caption: 'test11111' }
]

const recentActivities = ref([
  { icon: 'person_add', color: 'positive', text: 'New user registered', time: '5 minutes ago' },
  { icon: 'attach_money', color: 'primary', text: 'New sale recorded', time: '30 minutes ago' },
  { icon: 'update', color: 'secondary', text: 'Project status updated', time: '1 hour ago' },
  { icon: 'error', color: 'negative', text: 'System alert received', time: '2 hours ago' },
])

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
