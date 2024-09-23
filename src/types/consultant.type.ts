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

