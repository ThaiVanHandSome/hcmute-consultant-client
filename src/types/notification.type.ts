export interface Notification {
  status: string
  data: {
    senderId: number
    content: string
    time: string
    notificationType: string
    status: string
  }
}
