export interface User {
  id: number
  studentCode: string
  username: string
  schoolName: string
  firstName: string
  lastName: string
  phone: string
  avatarUrl: string
  gender: string
  email: string
  name: string
  address: {
    line: string
    provinceCode: string
    districtCode: string
    wardCode: string
  }
}

export interface UserUpdate {
  username: string
  studentCode: string
  schoolName: string
  firstName: string
  lastName: string
  phone: string
  avatarUrl: string
  gender: string
  addressLine: string
  provinceCode: string
  districtCode: string
  wardCode: string
  email: string
}

export interface UserOnline {
  fullName: string
  email: string
  phone: string
  status: string
}

export type Role = 'TUVANVIEN' | 'TRUONGBANTUVAN' | 'ADMIN'

export interface AdminUser {
  id: number
  createdAt: string
  isActivity: boolean
  username: string
  email: string
  department: {
    id: number
    name: string
  }
  role: {
    id: number
    name: string
  }
  roleConsultant: string
  lastActivity: string
  isOnline: boolean
}
