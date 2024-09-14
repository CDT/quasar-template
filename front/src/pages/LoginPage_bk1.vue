<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 login-card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">Quasar系统</div>
        <div class="text-grey-8">输入账号密码登录</div>
      </q-card-section>
      <q-card-section>
        <q-input dense outlined v-model="email" label="用户名"></q-input>
        <q-input dense outlined class="q-mt-md" v-model="password" type="password" label="密码"></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn style="
border-radius: 8px;" color="dark" rounded size="md" label="登录" no-caps class="full-width"></q-btn>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">还没有账号？
          <a href="#" class="text-dark text-weight-bold" style="text-decoration: none">注册.</a></div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref<string>('')
const password = ref<string>('')
</script>

<style scoped>
.login-card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
