import { Department } from '@/types/department.type'
import { Field } from '@/types/field.type'
import { RoleAsk } from '@/types/roleAsk.type'

export interface ForwardQuestion {
  id: number
  title: string
  fromDepartment: Department
  toDepartment: Department
  consultant: {
    id: number
    name: string
  }
  statusForward: boolean
  createdBy: number
  createdAt: string
  questionId: number
}

export interface Question {
  id: number
  department: Department
  field: Field
  roleAsk: RoleAsk
  title: string
  content: string
  createdAt: string
  views: number
  fileName: string
  askerFirstname: string
  askerLastname: string
  askerAvatarUrl: string
  answerTitle: string
  answerId: number
  answerContent: string
  answerUserFirstname: string
  answerUserLastname: string
  answerCreatedAt: string
  answerAvatarUrl: string
  answerFileName: string
  questionFilterStatus: string
  filterStatus: string[]
  forwardQuestionDTO: ForwardQuestion
  askerId: number
}

export interface CommonQuestion {
  commonQuestionId: number
  department: Department
  answerContent: string
  answerTitle: string
  content: string
  createdAt: string
  createdBy: { id: number; name: string }
  file: string
  fileAnswer: string
  status: boolean
  title: string
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

export type StatusKey = 'ANSWERED' | 'NOT_ANSWERED' | 'PRIVATE' | 'PUBLIC' | 'DELETED' | 'APPROVED'

export interface QuestionStatus {
  key: StatusKey
  displayName: string
}

export interface Answer {
  questionId: number
  title: string
  content: string
  statusApproval: boolean
}

export interface MyAnswer {
  answerId: number
  title: string
  content: string
  statusApproval: boolean
}

export interface DeletionLog {
  deletedAt: string
  deletedBy: string
  questionId: number
  questionTitle: string
  reason: string
}
