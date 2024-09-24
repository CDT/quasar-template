<template>

  <div class="q-mx-md q-my-md">
    When using object data binding, Handsontable needs to know what data structure to create when adding a new row. If your data source contains at least one row, Handsontable will figure out the data structure based on the first row.
  </div>

  <div class="q-mx-md q-my-md">
    <hot-table
      ref="hotInstance"
      :data="[
        ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
        ['2017', 10, 11, 12, 13, 15, 16],
        ['2018', 10, 11, 12, 13, 15, 16],
        ['2019', 10, 11, 12, 13, 15, 16],
        ['2020', 10, 11, 12, 13, 15, 16],
        ['2021', 10, 11, 12, 13, 15, 16],
      ]"
      height="auto"
      :authWrapRow="true"
      :autoWrapCol="true"
      licenseKey="non-commercial-and-evaluation"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();

const hotInstance = ref(null)

onMounted(() => {
  // use setDataAtCell method of hot table to set Tesla to Ford
  hotInstance.value.hotInstance.setDataAtCell(0, 1, 'Ford')
})
</script>
