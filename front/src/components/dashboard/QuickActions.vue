<template>
<q-list>
  <action-item v-for="(action, index) in actions" :key="index" v-bind="action" />
</q-list>
</template>

<script setup lang="ts">
import ActionItem from './ActionItem.vue'

const actions = [
  { iconName: 'add', iconColor: 'primary', label: 'New Project' },
  { iconName: 'mail', iconColor: 'secondary', label: 'Send Message' },
  { iconName: 'backup', iconColor: 'warning', label: 'Backup Data' },
]
</script>
