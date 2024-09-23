export interface PaginationConfig {
  page: number
  size: number
  sortBy: string
  sortDir: 'asc' | 'desc'
}

export interface ConsultantListConfig extends PaginationConfig {
  departmentId: string
  name: string
  sortBy: 'firstName' | 'lastName'
}

export interface ConversationListConfig extends PaginationConfig {
  name: string
  sortBy: 'createdAt' | 'lastName'
}

export interface QuestionListConfig extends PaginationConfig {
  departmentId: number
  status: string
  title: string
  startDate: Date
  endDate: Date
}

export interface ChatHistoryConfig extends PaginationConfig {
  conversationId: number
}
