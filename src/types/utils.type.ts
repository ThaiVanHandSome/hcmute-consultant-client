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
