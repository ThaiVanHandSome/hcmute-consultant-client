import { QueryConfig } from '@/pages/Home/components/ListQuestion/ListQuestion'
import { Question } from '@/types/question.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestion = (params: QueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('question/list', {
    params
  })
