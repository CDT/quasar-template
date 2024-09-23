<template>
  <div>如果不使用Handsontable，务必在package.json中移除依赖，并删除app.scss中引入的css</div>

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

<script>
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();

const data = [
  { id: 1, name: 'Ted Right', address: 'Stree A' },
  { id: 2, name: 'Frank Honest', address: 'Street B' },
  { id: 3, name: 'Joan Well', address: 'Street C' },
  { id: 4, name: 'Gail Polite', address: 'Street D' },
  { id: 5, name: 'Michael Fair', address: 'Street E' }
]

const columns = [
  { data: 'id', title: 'ID' },
  { data: 'name', title: 'Name' },
  { data: 'address', title: 'Address' }
]
 </script>
