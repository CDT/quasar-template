// src/stores/auth.ts
import { defineStore } from 'pinia'
import { api } from 'boot/axios' // Assuming you're using Axios for API calls
import { AuthState, Credentials } from 'src/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials: Credentials): Promise<boolean> {
      try {
        const response = await api.post<{ token: string }>('/login', credentials)
        this.token = response.data.token
        this.isAuthenticated = true

        // Store token in localStorage for persistence
        localStorage.setItem('token', this.token)

        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout(): void {
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    async initializeAuth(): Promise<void> {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Send a request to the server to validate the token
          const response = await api.post('/validate-token', { token })

          if (response.data.isValid) {
            this.token = token
            this.isAuthenticated = true
          } else {
            // Token is invalid or expired
            this.logout()
          }
        } catch (error) {
          console.error('Token validation failed:', error)
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
  }
})
