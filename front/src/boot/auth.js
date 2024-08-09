import { useAuthStore } from 'stores/auth'

export default () => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
}
