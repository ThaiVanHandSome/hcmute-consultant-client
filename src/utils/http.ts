import { URL_LOGIN, URL_REFRESH_TOKEN } from '@/apis/auth.api'
import { toast } from '@/hooks/use-toast'
import { AuthResponse } from '@/types/auth.type'
import { SuccessResponse } from '@/types/utils.type'
import {
  clearLS,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setRoleToLocalStorage
} from '@/utils/auth'
import { parseJWT } from '@/utils/utils'
import axios, { AxiosError, AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'

class HTTP {
  instance: AxiosInstance
  access_token: string
  refresh_token: string
  refreshTokenRequest: Promise<string> | null

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/api/v1/',
      timeout: 100000
    })

    this.access_token = getAccessTokenFromLocalStorage()
    this.refresh_token = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null

    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token && config.headers) {
          config.headers.Authorization = 'Bearer ' + this.access_token
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN) {
          this.access_token = (response.data as SuccessResponse<AuthResponse>).data.accessToken
          this.refresh_token = (response.data as SuccessResponse<AuthResponse>).data.refreshToken
          setAccessTokenToLocalStorage((response.data as SuccessResponse<AuthResponse>).data.accessToken)
          setRefreshTokenToLocalStorage((response.data as SuccessResponse<AuthResponse>).data.refreshToken)
          const payload = parseJWT((response.data as SuccessResponse<AuthResponse>).data.accessToken)
          setRoleToLocalStorage(payload.authorities)
        }
        return response
      },
      (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any | undefined = error.response?.data
        if (
          ![HttpStatusCode.Unauthorized, HttpStatusCode.UnprocessableEntity].includes(
            error.response?.status as HttpStatusCode
          ) &&
          !data?.type
        ) {
          const message = data?.message || error.message
          toast({
            variant: 'destructive',
            description: message
          })
        }
        if (error.status === HttpStatusCode.Unauthorized && data?.type === 'EXPIRE_TOKEN') {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          if (url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  this.refreshTokenRequest = null
                })
            return this.refreshTokenRequest?.then((accessToken) => {
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: 'Bearer ' + accessToken }
              })
            })
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<SuccessResponse<AuthResponse>>(URL_REFRESH_TOKEN, {
        refreshToken: this.refresh_token
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data
        setAccessTokenToLocalStorage(accessToken)
        setRefreshTokenToLocalStorage(refreshToken)
        this.access_token = accessToken
        this.refresh_token = refreshToken
        return accessToken
      })
      .catch((error) => {
        clearLS()
        this.access_token = ''
        this.refresh_token = ''
        throw error
      })
  }
}

const http = new HTTP().instance
export default http
