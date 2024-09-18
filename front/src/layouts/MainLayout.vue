<<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <router-link to="/" class="text-white text-no-decoration">
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

        
        <template v-for="link in filteredLinks" :key="link.title">
          <!-- 不带子菜单 -->
          <q-item v-if="!link.children" clickable :to="link.link" exact v-bind="link">
            <q-item-section v-if="link.icon" avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ link.title }}</q-item-label>
              <q-item-label caption>{{ link.caption }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- 带子菜单的 -->
          <q-expansion-item v-else :icon="link.icon" :label="link.title" :caption="link.caption">
            <q-list class="q-pl-md">
              <q-item v-for="childLink in link.children" :key="childLink.title" 
                clickable :to="childLink.link" exact v-bind="childLink" class="q-pl-md">
                <q-item-section v-if="childLink.icon" avatar>
                  <q-icon :name="childLink.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ childLink.title }}</q-item-label>
                  <q-item-label caption>{{ childLink.caption }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </template>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EssentialLinkProps } from 'src/types'
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
    caption: '基于Vue3的Handsontable示例',
    icon: 'account_box',
    children: [{
      title: '基本示例',
      icon: 'account_box',
      link: '/demo/handsontable'
    }, {
      title: '示例2',
      icon: 'account_box'
    }] 
  }
]

const filteredLinks = computed(() => {
  return linksList.filter( (link: EssentialLinkProps) => {
    
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
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
>