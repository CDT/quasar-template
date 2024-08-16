export interface Credentials {
  username?: string
  password?: string
  token?: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: User | null
}

export interface User {
  username: string
  email: string
  roles: string[]
}

export interface SelectOption {
  label: string,
  value: string | null
}