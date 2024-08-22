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
import { SelectOption, Dept } from 'src/types'
import { api } from 'boot/axios'
import { showNotification, showErrorRespNotification } from 'src/utils/notifications'

const keyword = ref('')
const selectedType = ref<string | null>(null)
const departments = ref<Array<Dept>>([{ area_name: '主院区', name: '妇科门诊', addr: '门诊大楼1楼',
    type_name: '门诊(3)', phone: '18986145582', sup_dept_name: '妇科' },
  { area_name: '光顾院区', name: '妇科门诊', addr: '门诊大楼1楼',
    type_name: '门诊(3)', phone: '18674016509', sup_dept_name: '妇科' } ])
const loading = ref(false)

const departmentTypes = ref<SelectOption[]>([])

const columns = [
  { name: 'area_name', label: '院区', field: 'arae_name', sortable: true },
  { name: 'name', label: '名称', field: 'name', sortable: true },
  { name: 'addr', label: '地址', field: 'addr', sortable: true },
  { name: 'type_name', label: '类型', field: 'type_name' },
  { name: 'phone', label: '电话', field: 'phone' },
  { name: 'sup_dept_name', label: '上级科室', field: 'sup_dept_name' }
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
    const resp = await api.get('/depts',
      { params: { keyword: keyword.value, type: selectedType.value } })
    console.log(resp.data?.data)
    departments.value.push(...resp.data?.data)
    console.log(departments.value)
  } catch (error: any) {
    showNotification(error.message, 'negative')
  } finally {
    loading.value = false
  }
}

// 初始化数据
api.get('/options?dict=ORG_TYPE').then( (resp: any) => {
  departmentTypes.value.push(...resp.data.data)
}).catch( (error: any) => {
  showErrorRespNotification(error)
})

</script>
