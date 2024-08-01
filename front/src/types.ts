export interface Credentials {
  username: string
  password: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}
