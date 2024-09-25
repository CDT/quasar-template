<template>
  <div class="q-mx-md q-my-md">
    PersistentState plugin should now work.
  </div>
  <div class="q-mx-md q-my-md">
    <hot-table :settings="hotSettings" id="hot1" ref="hot1" />
    <hot-table :settings="hotSettings" id="hot2" ref="hot2" />
  </div>
  <button @click="resetPersistentState('hot1')">Reset state for table 1</button>
  <button @click="resetPersistentState('hot2')">Reset state fro table 2</button>

</template>

<script setup>
import { ref } from 'vue' 
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { registerPlugin, PersistentState } from 'handsontable/plugins';

// register Handsontable's modules
registerAllModules();
registerPlugin(PersistentState);

const hot1 = ref(null);
const hot2 = ref(null)

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
  ],
  // exposed hooks. no need to overwrite these implementations.
  // persistentStateLoad: function(key, valuePlaceholder) {
  //   const storedValue = localStorage.getItem(key);
  //   if (storedValue) {
  //     valuePlaceholder.value = JSON.parse(storedValue);
  //   }
  // },
  // persistentStateReset: function(key) {
  //   localStorage.removeItem(key);
  // },
  // persistentStateSave: function(key, value) {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }
};

const resetPersistentState = (table_id) => {
  const hot = (table_id === 'hot1' ? hot1.value : hot2.value).hotInstance;
  hot.runHooks('persistentStateReset');  

  // TODO understant these:  
  hot.initIndexMappers();
  const mcmPlugin = hot.getPlugin('manualColumnMove');
  const csmPlugin = hot.getPlugin('columnSorting');
  const mcrPlugin = hot.getPlugin('manualColumnResize');
  mcmPlugin.updatePlugin();
  csmPlugin.updatePlugin();
  mcrPlugin.updatePlugin();
  hot.render();
};

</script>