import { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { RatingFormData } from '@/pages/User/ConsultantEvaluation/ConsultantEvaluation'
import { Consultant } from '@/types/consultant.type'
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
