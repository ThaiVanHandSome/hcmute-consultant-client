import { RegisterFormData } from '@/pages/Register/Register'
import { AuthResponse } from '@/types/auth.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const URL_LOGIN = 'auth/login'
export const URL_REGISTER = 'auth/register'

export const register = (body: RegisterFormData) => http.post<SuccessResponse<AuthResponse>>(URL_REGISTER, body)

export const confirmRegistration = (body: { emailRequest: string; token: string }) =>
  http.post<SuccessResponse<string>>('auth/confirm-registration', body)

export const login = (body: { email: string; password: string }) =>
  http.post<SuccessResponse<AuthResponse>>(URL_LOGIN, body)

export const resendRegisterVerificationCode = (body: { emailRequest: string }) =>
  http.post<SuccessResponse<string>>('auth/resend-register-verification-code', body)

export const changeEmail = (body: { oldEmail: string; newEmail: string }) =>
  http.post<SuccessResponse<string>>('auth/change-email', body)
