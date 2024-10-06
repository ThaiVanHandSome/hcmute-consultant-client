import { RegisterFormData } from '@/pages/Auth/Register/components/RegisterForm'
import { AuthResponse } from '@/types/auth.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const URL_LOGIN = 'auth/login'
export const URL_REGISTER = 'auth/register'
export const URL_REFRESH_TOKEN = 'auth/refresh'

export const register = (body: RegisterFormData) => http.post<SuccessResponse<AuthResponse>>(URL_REGISTER, body)

export const confirmRegistration = (body: { emailRequest: string; token: string }) =>
  http.post<SuccessResponse<string>>('auth/confirm-registration', body)

export const login = (body: { email: string; password: string }) =>
  http.post<SuccessResponse<AuthResponse>>(URL_LOGIN, body)

export const resendRegisterVerificationCode = (body: { emailRequest: string }) =>
  http.post<SuccessResponse<string>>('auth/resend-register-verification-code', body)

export const changeEmail = (body: { oldEmail: string; newEmail: string }) =>
  http.post<SuccessResponse<string>>('auth/change-email', body)

export const sendCodeToEmailToChangePassword = (body: { emailRequest: string }) =>
  http.post<SuccessResponse<string>>('auth/forgot-password', body)

export const verifyCodeWhenForgotPassword = (body: { emailRequest: string; code: string }) =>
  http.post('auth/verify-code', body)

export const resetPassword = (body: { email: string; newPassword: string }) =>
  http.post<SuccessResponse<string>>('auth/reset-password', body)

export const refreshToken = (body: { refreshToken: string }) =>
  http.post<SuccessResponse<AuthResponse>>(URL_REFRESH_TOKEN, body)

export const updatePassword = (body: { currentPassword: string; newPassword: string; confirmNewPassword: string }) =>
  http.put<SuccessResponse<string>>('profile/change-password', body)
