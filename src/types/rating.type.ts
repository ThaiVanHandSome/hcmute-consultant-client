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
