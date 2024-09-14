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
  label: string
  value: string | null
}

export interface Dept {
  code?: string,
  area_name?: string,
  name?: string
  address?: string
  type_name?: string
  phone?: string
  parent_org_name?: string
  enabled?: boolean
}
