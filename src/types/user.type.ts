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
