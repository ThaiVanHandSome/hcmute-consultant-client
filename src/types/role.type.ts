export interface RoleType {
  id: number
  name: string
  createdAt: string
}

export interface ConsultantRoleType {
  id: number
  name: string
  createdAt: string
  roleId: number
}
