export interface Chat {
  conversationId: number
  date: string
  id: number
  message: string
  imageUrl: string
  messageStatus: null

  receiver: {
    id: number
    name: string
    avatarUrl: string
  }[]
  sender: {
    id: number
    name: string
    avatarUrl: string
  }
  recalledBySender: boolean | null
  recalledForEveryone: boolean | null
  edited: boolean | null
  editedDate: string
}
