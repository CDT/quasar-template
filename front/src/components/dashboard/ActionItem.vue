<template>
  <q-item clickable v-ripple>
    <q-item-section avatar>
      <q-icon :name="iconName" :color="iconColor" />
    </q-item-section>
    <q-item-section>{{ label }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  iconName: string;
  iconColor: string;
  label: string;
}>()
</script>
