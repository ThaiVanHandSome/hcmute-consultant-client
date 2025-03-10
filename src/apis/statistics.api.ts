import { ConsultantStatistic } from '@/types/consultant.type'
import { ChartStatistics, UserStatistics } from '@/types/statistics.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getUserStatistics = () => http.get<SuccessResponse<UserStatistics>>('user/statistics')

export const getUserQuestionStatistics = (year: number) =>
  http.get<SuccessResponse<ChartStatistics[]>>('user/statistics/questions-status/yearly', {
    params: {
      year
    }
  })

export const getUserRatingStatistics = (year: number) =>
  http.get<SuccessResponse<ChartStatistics[]>>('user/statistics/ratings/yearly', {
    params: {
      year
    }
  })

export const getUserConversationStatistics = (year: number) =>
  http.get<SuccessResponse<ChartStatistics[]>>('user/statistics/conversations/yearly', {
    params: {
      year
    }
  })

export const getUserConsultantScheduleStatistics = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('user/statistics/consultationSchedule/yearly', {
    params: {
      year
    }
  })

export const getConsultantStatistics = () => http.get<SuccessResponse<ConsultantStatistic>>('statistics')

export const getConsultantStatisticDeletedQuestions = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('statistics/questions-deleted/yearly', {
    params: {
      year
    }
  })

export const getConsultantStatisticConversations = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('statistics/conversations/yearly', {
    params: {
      year
    }
  })

export const getConsultantStatisticSchedules = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('statistics/consultation-schedules/yearly', {
    params: {
      year
    }
  })

export const getConsultantStatisticPosts = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('statistics/posts/yearly', {
    params: {
      year
    }
  })

export const getConsultantStatisticAnswersGiven = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('statistics/answers-given/yearly', {
    params: {
      year
    }
  })
export const getConsultantStatisticAnswerApprovals = (year: number) =>
  http.get<SuccessResponse<ChartStatistics>[]>('statistics/questions-forwarded/yearly', {
    params: {
      year
    }
  })
