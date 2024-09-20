/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControlItem } from '@/types/utils.type'
import axios, { AxiosError, HttpStatusCode } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
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
