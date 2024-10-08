<template>
  <q-page class="window-height window-width row justify-center items-center" style="background: linear-gradient(#8274C5, #5A4A9F)">
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:400px;min-height:540px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md text-center">{{ title }}</h4>
          </q-card-section>
          <q-card-section>
            <q-fab color="primary" @click="switchTypeForm" icon="add" class="absolute" style="top: 0; right: 12px; transform: translateY(-50%)">
              <q-tooltip>新用户注册</q-tooltip>
            </q-fab>
            <q-form class="q-px-sm q-pt-xl">
              <q-input ref="emailRef" v-if="register" square clearable v-model="email" type="email" lazy-rules :rules="[required, isEmail, short]" label="邮箱">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input ref="usernameRef" square clearable v-model="username" lazy-rules :rules="[required, short]" type="text" label="用户名">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input ref="passwordRef" square clearable v-model="password" :type="passwordFieldType" lazy-rules :rules="[required, short]" label="密码">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
                </template>
              </q-input>
              <q-input ref="repasswordRef" v-if="register" square clearable v-model="repassword" :type="passwordFieldType" lazy-rules :rules="[required, short, diffPassword]" label="再次输入密码">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="secondary" @click="submit" class="full-width text-white" :label="btnLabel" />
          </q-card-actions>
          <q-card-section v-if="!register" class="text-center q-pa-sm">
            <a class="text-grey-6 text-no-decoration" href="#" @click="showNotification('暂不支持', 'warning')">忘记密码？</a>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { showNotification } from 'src/utils/notifications'
import { useAuthStore } from 'src/stores/auth'

const email = ref<string>('test@test.com')
const username = ref<string>('test')
const password = ref<string>('123123')
const repassword = ref<string>('')
const register = ref<boolean>(false)
const passwordFieldType = ref<'text' | 'password'>('password')
const visibility = ref<boolean>(false)
const visibilityIcon = ref<string>('visibility')

const emailRef = ref<any>(null)
const usernameRef = ref<any>(null)
const passwordRef = ref<any>(null)
const repasswordRef = ref<any>(null)

const title = computed(() => (register.value ? '注册' : '登录') + process.env.PROJECT_NAME)
const btnLabel = computed(() => register.value ? '注册' : '登录')

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

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

const submit = async () => {
  if (register.value) {
    emailRef.value?.validate()
    usernameRef.value.validate()
    passwordRef.value.validate()
    repasswordRef.value.validate()
    // Add registration logic here if needed
    showNotification('暂时不支持注册', 'warning')
  } else {
    usernameRef.value.validate()
    passwordRef.value.validate()

    if (!usernameRef.value.hasError && !passwordRef.value.hasError) {
      try {
        $q.loading.show()

        await authStore.login({
          username: username.value,
          password: password.value
        })

        showNotification('登录成功', 'positive')
        router.push('/')
        
      } catch (error: any) {
        showNotification('登录失败: ' + (error.response?.data?.message || error.message), 'negative')
      } finally {
        $q.loading.hide()
      }
    }
  }
}

const switchTypeForm = () => {
  register.value = !register.value

  if (register.value) {
    showNotification('暂时不支持注册', 'warning')
  }
}

const switchVisibility = () => {
  visibility.value = !visibility.value
  passwordFieldType.value = visibility.value ? 'text' : 'password'
  visibilityIcon.value = visibility.value ? 'visibility_off' : 'visibility'
}
</script>
