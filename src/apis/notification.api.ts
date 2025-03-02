import { NotificationPageResponse, NotificationResponse } from '@/types/notification.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getNotifications = () => http.get<SuccessResponse<NotificationPageResponse>>('notification')

export const markAsRead = (id: number) => http.post<SuccessResponse<void>>('notification/read', null, {
  params: { id }
})

export const markAllAsRead = () => http.post<SuccessResponse<void>>('notification/read-all', null)

export const getNotificationDetail = (id: number) => http.get<SuccessResponse<NotificationResponse>>('notification/detail', {
  params: { id }
})

export const deleteAllNotifications = () => http.post<SuccessResponse<void>>('notification/delete-all', null)

export const deleteNotification = (id: number) => http.post<SuccessResponse<void>>('notification/delete', null, {
  params: { id }
})
