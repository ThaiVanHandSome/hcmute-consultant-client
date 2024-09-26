export interface MemberConversation {
  id: number
  name: string
  avatarUrl: string
  sender: boolean
}

export interface Conversation {
  id: number
  department: {
    id: number
    name: string
  }
  name: string
  isGroup: boolean
  createdAt: string
  members: MemberConversation[]
}
