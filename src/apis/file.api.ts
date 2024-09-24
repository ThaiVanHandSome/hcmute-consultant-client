import http from '@/utils/http'

export const uploadFile = (formData: FormData) => http.post<{ fileUrl: string }>('upload', formData)
