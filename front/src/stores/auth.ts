// src/stores/auth.ts
import { defineStore } from 'pinia'
import { api } from 'boot/axios' // Assuming you're using Axios for API calls
import { AuthState, Credentials, User } from 'src/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    isAuthenticated: false,
    user: null
  }),

  actions: {
    async login(credentials: Credentials): Promise<void> {
      try {
        const response = await api.post('/login', credentials)
        this.token = response.data.data.token
        this.user = response.data.data.user
        this.isAuthenticated = true

        localStorage.setItem('token', this.token || '')
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error: any) {
        this.logout()
        throw error
      }
    },

    logout(): void {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        await this.login({ token })
        const authStore = useAuthStore()
      }
    }

  },

  getters: {
    getToken: (state: AuthState): string | null => state.token,
    getIsAuthenticated: (state: AuthState): boolean => state.isAuthenticated,
    getUser: (state: AuthState): User | null => state.user
  }
})
