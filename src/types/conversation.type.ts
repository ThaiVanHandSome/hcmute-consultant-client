export interface Conversation {
  id: number
  department: {
    id: number
    name: string
  }
  userName: string
  consultantName: string
  name: string
  isGroup: boolean
  createdAt: string
  members: {
    id: number
    fullName: string
  }[]
}

export interface ConversationListConfig {
  name: string
  page: number
  size: number
  sortBy: 'createdAt' | 'lastName'
  sortDir: 'asc' | 'desc'
}
