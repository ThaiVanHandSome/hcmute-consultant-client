export interface NotificationSocket {
  status: string
  data: {
    senderId: number
    content: string
    time: string
    notificationType: string
    status: string
  }
}

export interface NotificationResponse {
  id: number
  senderId: number
  content: string
  time: string
  notificationType: string
  status: string
}
