<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <router-link to="/"  class="text-white text-no-decoration">
          {{ projectName }}
          </router-link>
          / {{ $route.meta.name }}
        </q-toolbar-title>

        <q-btn flat round dense>
          <q-avatar color="warning" text-color="white">
            {{ authStore.getUser?.username.charAt(0) }}
            <q-tooltip>{{ authStore.getUser?.username }}</q-tooltip>
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section><q-icon name="logout" /></q-item-section>
                <q-item-section>退出</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>
          常用功能
        </q-item-label>

        <EssentialLink v-for="link in filteredLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

defineOptions({
  name: 'MainLayout'
})

const linksList: EssentialLinkProps[] = [
  {
    title: '科室查询',
    caption: '院内科室信息查询',
    icon: 'apartment',
    link: '/query/depts'
  },
  {
    title: 'Handsontable示例',
    caption: '一个基于Vue3的Handsontable示例',
    icon: 'account_box',
    link: '/demo/handsontable'
  }
]

const filteredLinks = computed(() => {
  return linksList.filter( (link: EssentialLinkProps) => {
    if (!link.link) return false
    const route = router.resolve(link.link)
    const requiredRoles = route.meta.requiredRoles as string[] || []

    // If no roles are required, show the link
    if (requiredRoles.length === 0) return true

    // Check if user has at least one of the required roles
    return authStore.user?.roles.some(role => requiredRoles.includes(role))
  })
})

const leftDrawerOpen = ref(true)
const projectName = process.env.PROJECT_NAME

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
  console.log(leftDrawerOpen.value)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
