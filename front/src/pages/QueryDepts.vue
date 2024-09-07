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
        :columns="dataColumns" row-key="id"
        :loading="loading" v-model:pagination="pagination"
        @request="searchDepartments">
        <!-- Loading -->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn color="info" outline icon="info" size="sm" @click="showDetails(props.row)" />
              <q-btn color="primary" outline icon="edit" size="sm" @click="console.log(props.row)" />
              <q-btn color="negative" outline icon="delete" size="sm" @click="console.log(props.row)" />
            </div>
          </q-td>
        </template>

      </q-table>
    </div>

    <!-- Detail Dialog -->
    <q-dialog v-model="detailDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">科室详情</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-table
            :rows="[selectedDepartment]"
            :columns="detailColumns"
            hide-bottom
            hide-header
            flat
            bordered
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <strong>{{ col.label }}:</strong> {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="关闭" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
  rowsNumber: 0,
  sortBy: 'area_name'
})
const departmentTypes = ref<SelectOption[]>([])
const detailDialog = ref(false)
const selectedDepartment = ref<Dept | null>(null)

const detailColumns: QTableColumn[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'area_name', label: '院区', field: 'area_name', align: 'left' },
  { name: 'name', label: '名称', field: 'name', align: 'left' },
  { name: 'addr', label: '地址', field: 'addr', align: 'left' },
  { name: 'type_name', label: '类型', field: 'type_name', align: 'left' },
  { name: 'phone', label: '电话', field: 'phone', align: 'left' },
  { name: 'sup_dept_name', label: '上级科室', field: 'sup_dept_name', align: 'left' },
  { name: 'created_at', label: '创建时间', field: 'created_at', align: 'left' },
  { name: 'updated_at', label: '更新时间', field: 'updated_at', align: 'left' },
]

const dataColumns: QTableColumn[] = [
  { name: 'area_name', label: '院区', field: 'area_name', sortable: true, align: 'center' },
  { name: 'name', label: '名称', field: 'name', sortable: true, align: 'center' },
  { name: 'addr', label: '地址', field: 'addr', sortable: true, align: 'center' },
  { name: 'type_name', label: '类型', field: 'type_name', align: 'center' },
  { name: 'phone', label: '电话', field: 'phone', align: 'center' },
  { name: 'sup_dept_name', label: '上级科室', field: 'sup_dept_name', align: 'center' },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' }
]

const searchDepartments = async (props?: any) => {
  loading.value = true
  try {
    const resp = await api.get('/depts',
      {
        params: {
          keyword: keyword.value,
          type: selectedType.value,
          page: pagination.value.page,
          per_page: pagination.value.rowsPerPage,
          sort_by: pagination.value.sortBy
        }
      })
    departments.value = resp.data?.data
    // update local pagination object
    if (props?.pagination) {
      pagination.value = { ...props.pagination }
    }
    pagination.value.rowsNumber = resp.data?.total || 0
  } catch (error: any) {
    showNotification(error.message, 'negative')
  } finally {
    loading.value = false
  }
}

const showDetails = (dept: Dept) => {
  selectedDepartment.value = dept
  detailDialog.value = true
}

// 初始化数据
api.get('/options?dict=ORG_TYPE').then( (resp: any) => {
  departmentTypes.value.push(...resp.data.data)
}).catch( (error: any) => {
  showErrorRespNotification(error)
})

searchDepartments()

</script>
