<template>
  <q-page padding>

    <!-- 搜索栏 -->
    <div class="row q-col-gutter-md q-px-md">
      <div class="col-12 col-md-5">
        <q-input v-model="keyword" label="关键字" outlined @keyup.enter="searchDepartments"></q-input>
      </div>
      <div class="col-12 col-md-5">
        <q-select v-model="selectedType" :options="departmentTypes" label="科室类型" outlined emit-value map-options />
      </div>
      <div class="col-12 col-md-2 self-center">
        <q-btn color="primary" icon="search" @click="searchDepartments" />
      </div>
    </div>

    <div class="q-mt-lg">
      <q-table :rows="departments" :columns="columns" row-key="id" :loading="loading" :filter="filter">
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SelectOption } from 'src/types'
import { api } from 'boot/axios'
import { showNotification, showErrorRespNotification } from 'src/utils/notifications'

const keyword = ref('')
const selectedType = ref<string | null>(null)
const departments = ref<Array<{id: number, name: string, type: string, description: string}>>([])
const loading = ref(false)

const departmentTypes = ref<SelectOption[]>([])

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Department Name', field: 'name', sortable: true },
  { name: 'type', label: 'Type', field: 'type', sortable: true },
  { name: 'description', label: 'Description', field: 'description' },
]

const filter = computed(() => {
  return {
    keyword: keyword.value,
    type: selectedType.value,
  }
})

const searchDepartments = async () => {
  loading.value = true
  try {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    departments.value = [
      { id: 1, name: 'General Surgery', type: 'surgery', description: 'Surgical procedures' },
      { id: 2, name: 'Cardiology', type: 'internal', description: 'Heart-related issues' },
      { id: 3, name: 'Pediatric Oncology', type: 'pediatrics', description: 'Cancer treatment for children' },
    ]
  } catch (error) {
    console.error('Error fetching departments:', error)
  } finally {
    loading.value = false
  }
}

// 初始化数据
api.get('/options?dict=ORG_TYPE').then( (resp: any) => {
  console.log(resp.data.data)
  // TODO
  departmentTypes.value.concat(resp.data.data)
}).catch( (error: any) => {
  showErrorRespNotification(error)
})
 
</script>