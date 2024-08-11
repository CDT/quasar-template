<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{ code }}
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ message }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="返回"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: '404'
  },
  message: {
    type: String,
    default: '啥都没有'
  }
})

defineOptions({
  name: 'ErrorNotFound'
});
</script>
