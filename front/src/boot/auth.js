import { useAuthStore } from 'stores/auth'

export default async () => {
  const authStore = useAuthStore()
  await authStore.initializeAuth()
}
