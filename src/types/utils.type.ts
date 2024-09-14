export interface SuccessResponse<T> {
  status: string
  message: string
  data: T
}

export interface ErrorResponse<T> {
  status: string
  message: string
  data?: T
}

export interface PaginationResponse<T> {
  content: T
  totalElements: number
  totalPages: number
  size: number
}

export interface FormControlItem {
  value: string
  label: string | React.ReactNode
}
