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
      <q-table :rows="departments"
        :columns="columns" row-key="id"
        :loading="loading" v-model:pagination="pagination"
        @request="onRequest">
        <!-- Loading -->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!-- Expand button -->
        <template v-slot:body-cell-expansion="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="console.log('expand')" icon="add" />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn color="primary" outline icon="edit" size="sm" @click="console.log(props.row)" />
              <q-btn color="negative" outline icon="delete" size="sm" @click="console.log(props.row)" />
            </div>
          </q-td>
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
import { QTableColumn } from 'quasar'

const keyword = ref('')
const selectedType = ref<string | null>(null)
const departments = ref<Array<Dept>>([])
const loading = ref(false)
const pagination = ref<any>({
  rowsPerPage: parseInt(process.env.PER_PAGE!),
  page: 1,
  rowsNumber: 0
})
const departmentTypes = ref<SelectOption[]>([])

const columns: QTableColumn[] = [
  { name: 'expansion', label: '+', field: 'expand', align: 'center' },
  { name: 'area_name', label: '院区', field: 'area_name', sortable: true, align: 'center' },
  { name: 'name', label: '名称', field: 'name', sortable: true, align: 'center' },
  { name: 'addr', label: '地址', field: 'addr', sortable: true, align: 'center' },
  { name: 'type_name', label: '类型', field: 'type_name', align: 'center' },
  { name: 'phone', label: '电话', field: 'phone', align: 'center' },
  { name: 'sup_dept_name', label: '上级科室', field: 'sup_dept_name', align: 'center' },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' }
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
      { params: {
          keyword: keyword.value,
          type: selectedType.value,
          page: pagination.value.page,
          per_page: pagination.value.rowsPerPage
        }
      })
    departments.value = resp.data?.data
    // pagination.value.page = page
    pagination.value.rowsNumber = resp.data?.total || 0
  } catch (error: any) {
    showNotification(error.message, 'negative')
  } finally {
    loading.value = false
  }
}

const onRequest = (props: any) => {
  const { page } = props.pagination
  searchDepartments()
}

// 初始化数据
api.get('/options?dict=ORG_TYPE').then( (resp: any) => {
  departmentTypes.value.push(...resp.data.data)
}).catch( (error: any) => {
  showErrorRespNotification(error)
})

searchDepartments()

</script>
