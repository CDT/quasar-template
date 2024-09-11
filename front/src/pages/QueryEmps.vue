<template>
  <q-page padding>
    <h5>Horizontal Key-Value Pair Display Demo</h5>

    <q-list bordered separator>
      <q-item v-for="(item, index) in data" :key="index">
        <q-item-section>
          <div class="row q-col-gutter-md">
            <div v-for="(value, key) in item" :key="key" class="col-xs-12 col-sm-4">
              <q-item-label overline>{{ key }}</q-item-label>
              <q-item-label>{{ value }}</q-item-label>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HorizontalKeyValueDemo',
  data () {
    return {
      data: [
        {
          'Name': 'John Doe',
          'Age': 30,
          'Email': 'john@example.com'
        },
        {
          'Location': 'New York',
          'Occupation': 'Software Developer',
          'Experience': '5 years'
        },
        {
          'Hobby': 'Photography',
          'Language': 'English, Spanish',
          'Education': 'Bachelor in CS'
        }
      ]
    }
  }
})
</script>