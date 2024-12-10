<template>
  <q-select
    v-model="model"
    :options="options"
    :loading="loading"
    @filter="onFilter"
    use-input
    input-debounce="300"
    :label="label"
    emit-value
    map-options
    outlined clearable dense
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import type { SelectOption } from 'src/types'
import { showErrorRespNotification } from 'src/utils/notifications';

const model = defineModel<string>()

const props = defineProps<{
  api: string
  label?: string
}>()

const options = ref<SelectOption[]>([])
const loading = ref(false)

const onFilter = async (val: string, update: (callback: () => void) => void) => {
  if (val.length < 2) {
    options.value = []
    update(() => {})
    return
  }

  loading.value = true
  
  try {
    const response = await api.get(props.api, {
      params: { keyword: val }
    })
    options.value = response.data?.data || []
  } catch (error) {
    showErrorRespNotification(error)
  } finally {
    loading.value = false
  }
  
  update(() => {})
}
</script>