import { User } from '@/types/user.type'

export interface AuthResponse {
  accessToken: string
  expiresIn: number
  refreshToken: string
  user: User
}

export type RegisterStatusType = 'create' | 'confirm' | 'success'
