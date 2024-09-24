<template>

  <div class="q-mx-md q-my-md">
    PersistentState plugin does not work. TODO fix it.
  </div>

  <div class="q-mx-md q-my-md">
    <hot-table :settings="hotSettings" />
  </div>
</template>

<script setup>
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { registerPlugin, PersistentState } from 'handsontable/plugins';

// register Handsontable's modules
registerAllModules();
registerPlugin(PersistentState);

const hotSettings = {
  licenseKey: 'non-commercial-and-evaluation',
  persistentState: true, // Enable the PersistentState plugin
  manualColumnResize: true,
  colHeaders: true,
  data: [
    ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
    ['2017', 10, 11, 12, 13, 15, 16],
    ['2018', 10, 11, 12, 13, 15, 16],
    ['2019', 10, 11, 12, 13, 15, 16],
    ['2020', 10, 11, 12, 13, 15, 16],
    ['2021', 10, 11, 12, 13, 15, 16]
  ]
};

</script>
