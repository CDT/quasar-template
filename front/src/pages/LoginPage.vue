<template>
  <q-page class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);">
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:400px;height:540px;">
          <!-- 标题 -->
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md text-center">{{ title }}</h4>
          </q-card-section>
          <q-card-section>
            <q-fab
              color="primary"
              @click="switchTypeForm"
              icon="add"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            >
              <q-tooltip>
                新用户注册
              </q-tooltip>
            </q-fab>
            <q-form class="q-px-sm q-pt-xl">
              <q-input
                ref="emailRef"
                square
                clearable
                v-model="email"
                type="email"
                lazy-rules
                :rules="[required, isEmail, short]"
                label="邮箱"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                ref="usernameRef"
                v-if="register"
                square
                clearable
                v-model="username"
                lazy-rules
                :rules="[required, short]"
                type="text"
                label="用户名"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input
                ref="passwordRef"
                square
                clearable
                v-model="password"
                :type="passwordFieldType"
                lazy-rules
                :rules="[required, short]"
                label="密码"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
              <q-input
                ref="repasswordRef"
                v-if="register"
                square
                clearable
                v-model="repassword"
                :type="passwordFieldType"
                lazy-rules
                :rules="[required, short, diffPassword]"
                label="再次输入密码"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="secondary"
              @click="submit"
              class="full-width text-white"
              :label="btnLabel"
            />
          </q-card-actions>
          <q-card-section
            v-if="!register"
            class="text-center q-pa-sm"
          >
            <p class="text-grey-6">忘记密码？</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const email = ref(null)
const username = ref(null)
const password = ref(null)
const repassword = ref(null)
const register = ref(false)
const passwordFieldType = ref<'text' | 'password'>('password')
const visibility = ref(false)
const visibilityIcon = ref('visibility')

const emailRef = ref<any>(null)
const usernameRef = ref<any>(null)
const passwordRef = ref<any>(null)
const repasswordRef = ref<any>(null)

const title = computed(() => (register.value ? '注册' : '登录') + process.env.PROJECT_NAME)
const btnLabel = computed(() => register.value ? '注册' : '登录')

const required = (val: string) => {
  return (val && val.length > 0) || '必填'
}

const diffPassword = (val: string) => {
  const val2 = password.value
  return val && val === val2 ? true : '不匹配'
}

const short = (val: string) => {
  return (val && val.length > 3) || '太短'
}

const isEmail = (val: string) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || '邮箱格式不符'
}

const submit = () => {
  if (register.value) {
    emailRef.value?.validate()
    usernameRef.value.validate()
    passwordRef.value.validate()
    repasswordRef.value.validate()
  } else {
    emailRef.value.validate()
    passwordRef.value.validate()
  }

  if (!register.value) {
    if (!emailRef.value.hasError && !passwordRef.value.hasError) {
      // Handle successful login
    }
  }
}

const switchTypeForm = () => {
  register.value = !register.value
}

const switchVisibility = () => {
  visibility.value = !visibility.value
  passwordFieldType.value = visibility.value ? 'text' : 'password'
  visibilityIcon.value = visibility.value ? 'visibility_off' : 'visibility'
}
</script>
