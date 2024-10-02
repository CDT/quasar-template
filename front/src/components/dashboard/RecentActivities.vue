<template>
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
</template>

<script setup lang="ts">
defineProps({
  recentActivities: {
    type: Array<{
      text: string;
      time: string;
      icon: string;
      color: string;
    }>,
    required: true,
  }
})
</script>
