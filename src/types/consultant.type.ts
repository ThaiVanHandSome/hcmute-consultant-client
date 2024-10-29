export interface Consultant {
  id: number
  firstName: string
  lastName: string
  phone: string
  department: {
    id: number
    name: string
  }
  avatarUrl: string
}

export interface SchedualConsultant {
  id: number
  department: {
    id: number
    name: string
  }
  userName: string
  consultantName: string
  title: string
  content: string
  mode: boolean
  statusPublic: boolean
  statusConfirmed: boolean
  consultationDate: string
  consultationTime: string
  location: string
  link: string
}

export interface SchedualConfirm {
  title: string
  content: string
  consultationDate: string
  consultationTime: string
  location?: string
  link?: string
  mode: boolean
  statusPublic: boolean
  statusConfirmed: boolean
}

export interface ConsultantStatistic {
  totalQuestionsInDay: number
  totalForwardedQuestions: number
  totalDeletedQuestions: number
  totalAnswersGiven: number
  totalAnswerApproval: number
  totalConsultantSchedule: number
  totalApprovedPosts: number
  totalConversations: number
}
