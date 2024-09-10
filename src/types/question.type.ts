import { Department } from '@/types/department.type'
import { Field } from '@/types/field.type'
import { RoleAsk } from '@/types/roleAsk.type'

export interface Question {
  department: Department
  field: Field
  roleAsk: RoleAsk
  title: string
  content: string
  createdAt: string
  views: number
  askerFirstname: string
  askerLastname: string
  answerTitle: string
  answerContent: string
  answerUserFirstname: string
  answerUserLastname: string
  answerCreatedAt: string
}

export interface QuestionListConfig {
  page: number
  size: number
  sortBy: string
  sortDir: 'asc' | 'desc'
  departmentId: number
}

export interface CreateQuestionRequest {
  departmentId: string
  fieldId: string
  roleAskId: string
  title: string
  content: string
  firstName: string
  lastName: string
  studentCode: string
  statusPublic: boolean
}

export interface CreateQuestionResponse {
  departmendId: number
  fieldId: number
  roleAskId: number
  title: string
  content: string
  firstName: string
  lastName: string
  studentCode?: string
  statusPublic: boolean
  fileName: string
  views: number
  statusApproval: boolean
  createdAt: string
  updatedAt: string
}
