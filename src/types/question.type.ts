import { Department } from '@/types/department.type'
import { Field } from '@/types/field.type'

export interface Question {
  department: Department
  field: Field
  roleAsk: {
    id: number
    name: string
  }
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
}
