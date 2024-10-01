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

export interface SchedualConsultant {
  id: number
  department: {
    id: number
    name: string
  }
  consultantName: string
  title: string
  content: string
  mode: boolean
  statusPublic: boolean
}
