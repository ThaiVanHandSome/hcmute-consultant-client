import { QueryConfig } from './utils.type'

export interface Rating {
  id: number
  consultant: {
    id: number
    name: string
  }
  department: {
    id: number
    name: string
  }
  user: {
    id: number
    name: string
  }
  generalSatisfaction: ''
  generalComment: ''
  expertiseKnowledge: ''
  expertiseComment: ''
  attitude: ''
  attitudeComment: ''
  responseSpeed: ''
  responseSpeedComment: ''
  understanding: ''
  understandingComment: ''
}

export interface RatingType {
  id: number
  fullName: string
  studentCode: string
  email: string
  department: string
  role: string
  ratingCount: number
  generalSatisfaction: number
  expertiseKnowledge: number
  attitude: number
  responseSpeed: number
  understanding: number
}

export type RatingQueryConfig = {
  fromDate?: string
  toDate?: string
} & QueryConfig
