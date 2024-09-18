import { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { Consultant } from '@/types/consultant.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllConsultant = (params: ConsultantQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Consultant[]>>>('list-consultant', {
    params
  })
