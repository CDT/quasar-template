<template>
  <q-card>
    <q-card-section>
      <div class="row items-center justify-between">
        <div class="col">
          <div class="text-h6">{{ title }}</div>
          <div class="text-h4 q-mt-sm">{{ content }}</div>
          <div class="q-mt-xs">{{ caption }}</div>
        </div>
        <q-icon :name="icon" size="xl" :style="{ color: icon_color }" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  content: { type: String, required: true },
  icon: { type: String, required: true },
  caption: { type: String, required: true },
  icon_color: { type: String, required: false, default: 'white' }
})
</script>
