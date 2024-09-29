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
