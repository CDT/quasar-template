<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Hospital Department Search</h1>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="keyword"
          label="Search by keyword"
          outlined
          @keyup.enter="searchDepartments"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="selectedType"
          :options="departmentTypes"
          label="Department Type"
          outlined
          emit-value
          map-options
        />
      </div>
    </div>

    <div class="q-mt-md">
      <q-btn color="primary" label="Search" @click="searchDepartments" />
    </div>

    <div class="q-mt-lg">
      <q-table
        :rows="departments"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DepartmentSearch',
  setup() {
    const keyword = ref('')
    const selectedType = ref(null)
    const departments = ref([])
    const loading = ref(false)

    const departmentTypes = [
      { label: 'All', value: null },
      { label: 'Surgery', value: 'surgery' },
      { label: 'Internal Medicine', value: 'internal' },
      { label: 'Pediatrics', value: 'pediatrics' },
      { label: 'Oncology', value: 'oncology' },
    ]

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

    return {
      keyword,
      selectedType,
      departmentTypes,
      departments,
      columns,
      loading,
      filter,
      searchDepartments,
    }
  }
}
</script>