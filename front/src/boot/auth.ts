import { useAuthStore } from 'stores/auth'

// TODO any and this does not work
export default ({ app } : { app: any }) => {
  console.log(app)
  const authStore = useAuthStore()
  authStore.initializeAuth()
}
