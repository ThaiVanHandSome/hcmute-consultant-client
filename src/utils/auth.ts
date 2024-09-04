export const setAccessTokenToLocalStorage = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLocalStorage = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const removeAuthInfoFromLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  localStorage.removeItem('refresh_token')
}

export const getAccessTokenFromLocalStorage = (): string => {
  return localStorage.getItem('access_token') ?? ''
}

export const getRefreshTokenFromLocalStorage = (): string => {
  return localStorage.getItem('refresh_token') ?? ''
}
