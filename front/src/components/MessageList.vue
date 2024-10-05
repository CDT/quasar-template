<template>
  <q-list style="min-width: 250px">
    <q-item v-for="message in messages" :key="message.id" clickable @click="handleClick(message)">
      <q-item-section avatar>
        <q-icon :name="message.icon" :color="message.color" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ message.type }}</q-item-label>
        <q-item-label caption>{{ message.content }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label caption>{{ message.timestamp }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { Message } from 'src/types'
import { PropType } from 'vue'

defineProps({
  messages: {
    type: Array as PropType<Message[]>,
    required: true
  }
})

const handleClick = (message: Message) => {
  console.log('Clicked:', message)
}
</script>
