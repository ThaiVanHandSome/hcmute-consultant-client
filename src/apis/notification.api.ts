import { Notification } from '@/types/notification.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getNotifications = () => http.get<SuccessResponse<Notification[]>>('notification')
