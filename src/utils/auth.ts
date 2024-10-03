import { User, UserOnline } from '@/types/user.type'

export const AuthenticationTarget = new EventTarget()

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('ROLE')
  const clearLSEvent = new Event('clearLS')
  AuthenticationTarget.dispatchEvent(clearLSEvent)
}

export const setAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const getAccessTokenFromLocalStorage = (): string => {
  return localStorage.getItem('accessToken') ?? ''
}

export const getRefreshTokenFromLocalStorage = (): string => {
  return localStorage.getItem('refreshToken') ?? ''
}

export const getUserFromLocalStorate = () => {
  return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : {}
}

export const setUserToLocalStorage = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getOnlineUsersFromLocalStorate = () => {
  return localStorage.getItem('onlineUsers') ? JSON.parse(localStorage.getItem('onlineUsers') as string) : []
}

export const setOnlineUsersToLocalStorate = (onlineUsers: UserOnline[]) => {
  localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers))
}

export const setRoleToLocalStorage = (role: string) => {
  localStorage.setItem('ROLE', role)
}

export const getRoleFromLocalStorage = () => {
  return localStorage.getItem('ROLE') ?? ''
}
