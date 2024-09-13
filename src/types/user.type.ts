export interface User {
  id: number
  username: string
  studentCode: string
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
