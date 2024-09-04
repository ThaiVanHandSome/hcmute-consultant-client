import { URL_LOGIN, URL_REGISTER } from '@/apis/auth.api'
import { AuthResponse } from '@/types/auth.type'
import { SuccessResponse } from '@/types/utils.type'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/utils/auth'
import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'

class HTTP {
  instance: AxiosInstance
  access_token: string
  refresh_token: string

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/api/v1/',
      timeout: 10000
    })

    this.access_token = getAccessTokenFromLocalStorage()
    this.refresh_token = getRefreshTokenFromLocalStorage()

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
        if (url === URL_LOGIN || url === URL_REGISTER) {
          setAccessTokenToLocalStorage((response.data as SuccessResponse<AuthResponse>).data.access_token)
          setRefreshTokenToLocalStorage((response.data as SuccessResponse<AuthResponse>).data.refresh_token)
        }
        return response
      },
      (error: AxiosError) => {
        if (
          ![HttpStatusCode.Unauthorized, HttpStatusCode.UnprocessableEntity].includes(
            error.response?.status as HttpStatusCode
          )
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new HTTP().instance
export default http
