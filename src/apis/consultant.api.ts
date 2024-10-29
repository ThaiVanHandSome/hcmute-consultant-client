import { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { RatingQueryConfig } from '@/hooks/useRatingQueryConfig'
import { RatingFormData } from '@/pages/User/ConsultantEvaluation/ConsultantEvaluation'
import { Consultant, SchedualConfirm, SchedualConsultant } from '@/types/consultant.type'
import { Rating } from '@/types/rating.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllConsultant = (params: ConsultantQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Consultant[]>>>('list-consultant', {
    params
  })

export const getConsultantsByDepartment = (departmentId: string) =>
  http.get<SuccessResponse<Consultant[]>>('list-consultant-by-department', {
    params: {
      departmentId
    }
  })

export const createRating = (body: RatingFormData) =>
  http.post<SuccessResponse<RatingFormData>>('user/rating/create', body)

export const getAllRating = (params: RatingQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Rating[]>>>('rating/list', {
    params
  })

export const getRatingById = (id: string) =>
  http.get<SuccessResponse<Rating>>('rating/detail', {
    params: {
      id
    }
  })

export const getPastRating = (consultantId: string) =>
  http.get<SuccessResponse<Rating>>('list-consultant-rating-by-department', {
    params: {
      consultantId
    }
  })

export const getTeacherConsultantsByDepartment = (departmentId: number) =>
  http.get<SuccessResponse<Consultant[]>>('list-consultant-teacher-by-department', {
    params: {
      departmentId
    }
  })

export const getSchedualById = (scheduleId: number) =>
  http.get<SuccessResponse<SchedualConsultant>>('consultation-schedule/detail', {
    params: {
      scheduleId
    }
  })

export const confirmSchedual = (scheduleId: number, body: SchedualConfirm) =>
  http.post<SuccessResponse<string>>('consultant/consultation-schedule/confirm', body, {
    params: {
      scheduleId
    }
  })
