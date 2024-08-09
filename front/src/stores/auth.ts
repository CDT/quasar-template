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
    async login(credentials: Credentials): Promise<boolean> {
      try {
        const response = await api.post('/login', credentials)
        this.token = response.data.data.token
        this.user = response.data.data.user
        this.isAuthenticated = true

        // Store token in localStorage for persistence
        localStorage.setItem('token', this.token || '')
        localStorage.setItem('user', JSON.stringify(this.user))

        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout(): void {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async initializeAuth(): Promise<void> {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Send a request to the server to validate the token
          const response = await api.post('/login', { token })

          if (response.data.success) {
            this.token = response.data.data.token
            this.user = response.data.data.user
            this.isAuthenticated = true
          } else {
            // Token is invalid or expired
            this.logout()
          }
        } catch (error: any) {
          console.error('Token validation failed:', error.response?.data?.message || error.message)
          this.logout()
        }
      } else {
        this.logout()
      }
    }
  },

  getters: {
    getToken: (state: AuthState): string | null => state.token,
    getIsAuthenticated: (state: AuthState): boolean => state.isAuthenticated,
    getUser: (state: AuthState): User | null => state.user
  }
})
