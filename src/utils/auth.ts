export const setAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const removeAuthInfoFromLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  localStorage.removeItem('refreshToken')
}

export const getAccessTokenFromLocalStorage = (): string => {
  return localStorage.getItem('accessToken') ?? ''
}

export const getRefreshTokenFromLocalStorage = (): string => {
  return localStorage.getItem('refreshToken') ?? ''
}
