<template>
  <div>如果不使用Handsontable，务必在package.json中移除依赖，并删除app.scss中引入的css</div>
  <hot-table :data="data" :rowHeaders="true" :colHeaders="true" licenseKey="non-commercial-and-evaluation"></hot-table>
</template>

<script>
import { defineComponent } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();

export default defineComponent({
  data() {
    return {
      data: [
        ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
        ['2016', 10, 11, 12, 13],
        ['2017', 20, 11, 14, 13],
        ['2018', 30, 15, 12, 13]
      ],
    };
  },
  components: {
    HotTable,
  }
});
</script>