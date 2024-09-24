<template>

  <div class="q-mx-md q-my-md">
    When using object data binding, Handsontable needs to know what data structure to create when adding a new row. If your data source contains at least one row, Handsontable will figure out the data structure based on the first row.
  </div>
  <div class="q-mx-md q-my-md">
In a scenario where you start with an empty data source, you will need to provide the dataSchema option containing the data structure for any new row added to the grid. The example below shows a custom data schema with an empty data source:
  </div>

  <div class="q-mx-md q-my-md">
    <hot-table
      :data="[]"
      :dataSchema="{ id: null, name: { first: null, last: null }, address: null }"
      :colHeaders="['ID', 'First Name', 'Last Name', 'Address']"
      height="auto"
      width="auto"
      :columns="[
        { data: 'id' },
        { data: 'name.first' },
        { data: 'name.last' },
        { data: 'address' },
      ]"
      :minSpareRows="1"
      licenseKey="non-commercial-and-evaluation"
    />
  </div>
</template>

<script setup>
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();
</script>
