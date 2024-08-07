import { useAuthStore } from 'stores/auth'

export default ({ app }) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
}
