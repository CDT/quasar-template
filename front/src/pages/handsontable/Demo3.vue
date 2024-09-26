<template>

  <div class="q-mx-md q-my-md">
    <hot-table
      licenseKey="non-commercial-and-evaluation"
      :data="data"
      :columns="columns"
      :rowHeaders="true"
      :colHeaders="true"
    />
  </div>
</template>

<script setup>
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();

const data = [
  { id: 1, name: { first: 'Ted', last: 'Right' }, address: '' },
  { id: 2, address: '' },
  { id: 3, name: { first: 'Joan', last: 'Well' }, address: '' },
]

const columns = [
  { data: 'id' },
  { data: 'name.first' },
  { data: 'name.last' },
  { data: 'address' },
]
</script>
