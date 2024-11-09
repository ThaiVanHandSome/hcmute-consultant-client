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

export interface SchedualListConfig extends PaginationConfig {
  departmentId: number
  title: string
  startDate: Date
  endDate: Date
  statusPublic: boolean
  statusConfirmed: boolean
  mode: boolean
}

export interface RatingListConfig extends PaginationConfig {
  departmentId: number
  consultantName: string
  startDate: Date
  endDate: Date
}

export interface ChatHistoryConfig extends PaginationConfig {
  conversationId: number
}

export interface PostListConfig extends PaginationConfig {
  isApproved: boolean
}

export interface CommonQuestionListConfig extends PaginationConfig {
  title: string
}

export interface DistrictListConfig extends PaginationConfig {
  provinceCode: string
}

export interface WardListConfig extends PaginationConfig {
  districtCode: string
}

export interface RoleListConfig extends PaginationConfig {
  name: string
}

export interface ConsultantRoleListConfig extends PaginationConfig {
  name: string
  roleId: number
}

export interface FieldListConfig extends PaginationConfig {
  name: string
  departmentId: number
}

export interface DepartmentListConfig extends PaginationConfig {
  name: string
}

export interface UserListConfig extends PaginationConfig {
  name: string
  email: string
  isOnline: boolean
  isActivity: boolean
}
