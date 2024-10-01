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
