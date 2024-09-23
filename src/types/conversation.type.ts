export interface Conversation {
  id: number
  department: {
    id: number
    name: string
  }
  name: string
  isGroup: boolean
  createdAt: string
  members: {
    id: number
    name: string
    avatarUrl: string
    sender: boolean
  }[]
}

export interface ConversationListConfig {
  name: string
  page: number
  size: number
  sortBy: 'createdAt' | 'lastName'
  sortDir: 'asc' | 'desc'
}
