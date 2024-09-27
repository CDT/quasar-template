<template>
  <q-page padding>

    <!-- 搜索栏 -->
    <div class="row q-col-gutter-md q-px-md justify-center">
      <div class="col-6 col-md-3">
        <q-input v-model="keyword" label="关键字" outlined @keyup.enter="searchDepartments" clearable />
      </div>
      <div class="col-6 col-md-3">
        <q-select v-model="selectedType" :options="departmentTypes" label="科室类型" outlined emit-value map-options clearable />
      </div>
      <div class="col-2 self-center">
        <q-btn color="primary" icon="search" @click="searchDepartments()" />
      </div>
    </div>

    <div class="q-mt-lg">
      <q-table :rows="departments"
        :columns="dataColumns" row-key="id"
        :loading="loading" v-model:pagination="pagination"
        @request="searchDepartments">

        
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusLabel(props.row.enabled).color">
              {{ getStatusLabel(props.row.enabled).text }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn color="info" outline icon="info" size="sm" @click="showDetails(props.row)" />
              <q-btn color="primary" outline icon="edit" size="sm" @click="editDepartment(props.row)" />
              <q-btn color="negative" outline icon="delete" size="sm" @click="deleteDepartment(props.row)" />
            </div>
          </q-td>
        </template>

      </q-table>
    </div>

    <!-- Detail Dialog -->
    <q-dialog v-model="detailDialog">
      <q-card style="min-width: 1000px">
        <q-card-section>
          <q-tabs v-model="activeTab" class="text-primary">
            <q-tab name="tab1" label="基本信息" />
            <q-tab name="tab2" label="Tab 2" />
            <q-tab name="tab3" label="Tab 3" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="tab1">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-4" v-for="(field, index) in detailFields" :key="index">
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>{{ field.label }}</q-item-label>
                      <q-item-label>{{ (selectedDepartment as any)[field.value] }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="tab2">
              <!-- Content for Tab 2 -->
              <div>Content for Tab 2</div>
            </q-tab-panel>
            <q-tab-panel name="tab3">
              <!-- Content for Tab 3 -->
              <div>Content for Tab 3</div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="关闭" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 编辑对话框 -->
    <q-dialog v-model="isEditDialogVisible" persistent>
      <q-card style="width: 900px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">编辑部门</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSave">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="selectedDepartment.code"
                  label="编码"
                  :rules="[val => !!val || '编码是必填项']"
                  filled
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="selectedDepartment.name"
                  label="名称"
                  :rules="[val => !!val || '名称是必填项']"
                  filled
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="selectedDepartment.area_name"
                  :options="areaOptions"
                  label="院区"
                  :rules="[val => !!val || '院区是必填项']"
                  filled
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="selectedDepartment.type_name"
                  :options="departmentTypes"
                  label="类型"
                  :rules="[val => !!val || '类型是必填项']"
                  filled
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="selectedDepartment.phone"
                  label="电话"
                  :rules="[val => /^[0-9-+]+$/.test(val) || '请输入有效的电话号码']"
                  filled
                />
              </div>
              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="selectedDepartment.parent_org_name"
                  :options="departmentOptions"
                  label="上级科室"
                  filled
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="selectedDepartment.address"
                  label="地址"
                  filled
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="取消" color="negative" v-close-popup />
          <q-btn flat label="保存" color="positive" @click="handleSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SelectOption, Dept } from 'src/types'
import { api } from 'boot/axios'
import { showNotification, showErrorRespNotification } from 'src/utils/notifications'
import { QTableColumn, Dialog } from 'quasar'

defineOptions({
  name: 'QueryDepts'
})

const keyword = ref('')
const selectedType = ref<string | null>(null)
const departments = ref<Dept[]>([])
const loading = ref(false)
const pagination = ref<any>({
  rowsPerPage: parseInt(process.env.PER_PAGE!),
  page: 1,
  rowsNumber: 0,
  sortBy: 'area_name'
})
const departmentTypes = ref<SelectOption[]>([])
const detailDialog = ref(false)
const activeTab = ref('tab1')
const selectedDepartment = ref<Dept>({})
const isEditDialogVisible = ref<boolean>(false)

const dataColumns: QTableColumn[] = [
  { name: 'code', label: '编码', field: 'code', align: 'left' },
  { name: 'area_name', label: '院区', field: 'area_name', sortable: true, align: 'center' },
  { name: 'name', label: '名称', field: 'name', sortable: true, align: 'center' },
  { name: 'status', label: '状态', field: 'enabled', align: 'center' },
  { name: 'address', label: '地址', field: 'address', sortable: true, align: 'center' },
  { name: 'type_name', label: '类型', field: 'type_name', align: 'center' },
  { name: 'phone', label: '电话', field: 'phone', align: 'center' },
  { name: 'sup_dept_name', label: '上级科室', field: 'parent_org_name', align: 'center' },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' }
]

const detailFields = [
  { label: '编码', value: 'code' },
  { label: '院区', value: 'area_name' },
  { label: '名称', value: 'name' },
  { label: '地址', value: 'address' },
  { label: '类型', value: 'type_name' },
  { label: '电话', value: 'phone' },
  { label: '上级科室', value: 'sup_dept_name' }
]

const areaOptions = ref<any>([])
const departmentOptions = ref<any>([])

const searchDepartments = async (props?: any) => {
  loading.value = true
  const { page, rowsPerPage, sortBy } = props?.pagination || pagination.value
  try {
    const { data } = await api.get('/depts', {
      params: {
        keyword: keyword.value,
        type: selectedType.value,
        page,
        per_page: rowsPerPage,
        sort_by: sortBy
      }
    })
    departments.value = data?.data?.rows || []
    pagination.value = { ...pagination.value, ...props?.pagination, rowsNumber: data?.data?.total || 0 }
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

const editDepartment = (row: Dept) => {
  selectedDepartment.value = {...row}
  isEditDialogVisible.value = true
}

const deleteDepartment = (row: Dept) => {
  Dialog.create({
    title: '确认删除',
    message: '确定要删除吗？',
    focus: 'cancel',
    persistent: true,
    ok: {
      label: '确定',
      flat: true,
      color: 'negative'
    },
    cancel: '取消'
  }).onOk(() => {
    // User clicked OK
    console.log('OK')
    showNotification('不删除，只是一个示例', 'info')
  }).onCancel(() => {
    // User clicked Cancel
    console.log('Cancel')
  }).onDismiss(() => {
    // Dialog was dismissed
    console.log('Dismissed')
  })
}

const handleSave = () => {
  console.log('Save', selectedDepartment.value)
  showNotification('不保存，只是一个示例', 'info')
  isEditDialogVisible.value = false
}

const getStatusLabel = (enabled: string) => {
  if (enabled === '0') {
    return { text: '已禁用', color: 'red' }
  } else if (enabled === '1') {
    return { text: '正常', color: 'green' }
  } else {
    return { text: '未知', color: 'gray' }
  }
}

// 初始化数据
api.get('/options?dict=ORG_TYPE').then( (resp: any) => {
  departmentTypes.value.push(...resp.data.data)
}).catch( (error: any) => {
  showErrorRespNotification(error)
})

searchDepartments()

</script>
