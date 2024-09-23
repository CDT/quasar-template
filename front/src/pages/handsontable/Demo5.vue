<template>

  <div class="q-mx-md q-my-md">
    If your dataSchema is a constructor of an object that doesn't directly expose its members, you can specify functions for the data member of each columns item.
  </div>

  <div class="q-mx-md q-my-md">
    <hot-table
      :data="[
        model({ id: 1, name: 'Ted Right', address: '' }),
        model({ id: 2, name: 'Frank Honest', address: '' }),
        model({ id: 3, name: 'Joan Well', address: '' }),
        model({ id: 4, name: 'Gail Polite', address: '' }),
        model({ id: 5, name: 'Michael Fair', address: '' }),
      ]"
      :dataSchema="model"
      height="auto"
      width="auto"
      :colHeaders="['ID', 'Name', 'Address']"
      :columns="[
        { data: property('id') },
        { data: property('name') },
        { data: property('address') },
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

function model(person) {
  const _pub = {
    id: undefined,
    name: undefined,
    address: undefined,
    attr: () => _pub,
  };

  const _priv = {};

  for (const prop in person) {
    if (person.hasOwnProperty(prop)) {
      _priv[prop] = person[prop];
    }
  }

  _pub.attr = (attr, val) => {
    if (typeof val === 'undefined') {
      window.console && console.log('GET the', attr, 'value of', _pub);

      return _priv[attr];
    }

    console.log('SET the', attr, 'value of', _pub);
    _priv[attr] = val;

    return _pub;
  };

  return _pub;
}

function property(attr) {
  return (row, value) => row.attr(attr, value);
}
</script>
