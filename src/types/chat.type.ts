export interface Chat {
  conversationId: number
  date: string
  id: number
  message: string
  messageStatus: null
  receiver: {
    id: number
    name: string
    avatarUrl: string
  }
  sender: {
    id: number
    name: string
    avatarUrl: string
  }
}
