export const ROLE = {
  user: 'USER',
  consultant: 'TUVANVIEN',
  advisor: 'TRUONGBANTUVAN',
  admin: 'ADMIN'
} as const

export type Role = (typeof ROLE)[keyof typeof ROLE]
