export interface Consultant {
  id: number
  firstName: string
  lastName: string
  phone: string
  department: {
    id: number
    name: string
  }
  avatarUrl: string
}

export interface ConsultantListConfig {
  departmentId: string
  name: string
  page: number
  size: number
  sortBy: 'firstName' | 'lastName'
  sortDir: 'asc' | 'desc'
}
