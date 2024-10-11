/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControlItem } from '@/types/utils.type'
import axios, { AxiosError, HttpStatusCode } from 'axios'
import audioNotice from '@/assets/audios/audio_notification.mp3'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function formatDate(dateString: string, haveHour?: boolean) {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (!haveHour) return `${day}-${month}-${year}`
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
}

export const parseDate = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day + 1)
}

export const generateSelectionData = (data: any): FormControlItem[] | undefined => {
  return data?.map((item: any) => {
    return {
      value: String(item.id),
      label: item.name
    }
  })
}

export const generateSelectionDataFromLocation = (data: any): FormControlItem[] | undefined => {
  return data?.map((item: any) => {
    return {
      value: String(item.code),
      label: item.fullName
    }
  })
}

export const parseJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    console.log(JSON.parse(jsonPayload))

    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Invalid JWT format', e)
    return null
  }
}

let userInteracted = false
export const registerUserInteraction = () => {
  if (!userInteracted) {
    document.addEventListener(
      'click',
      () => {
        userInteracted = true
      },
      { once: true }
    )

    document.addEventListener(
      'keydown',
      () => {
        userInteracted = true
      },
      { once: true }
    )
  }
}

export const playNotificationSound = () => {
  if (userInteracted) {
    const audio = new Audio(audioNotice)
    audio.play().catch((error) => {
      console.error('Error playing sound:', error)
    })
  }
}

export function isImageFile(fileName: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']
  const fileExtension = fileName.split('.').pop()?.toLowerCase()
  if (!fileExtension) return false
  return imageExtensions.includes(fileExtension)
}
