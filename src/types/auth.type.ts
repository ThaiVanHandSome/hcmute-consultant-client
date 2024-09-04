import { User } from '@/types/user.type'

export interface AuthResponse {
  access_token: string
  expiresIn: number
  refresh_token: string
  user: User
}

export type RegisterStatusType = 'create' | 'confirm' | 'success'
