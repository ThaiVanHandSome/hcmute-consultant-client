import { QueryConfig } from '@/hooks/useQueryConfig'
import { CreateQuestionRequest, CreateQuestionResponse, Question } from '@/types/question.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestion = (params: QueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('list-question', {
    params
  })

export const createNewQuestion = (params: CreateQuestionRequest, file?: File) =>
  http.post<SuccessResponse<CreateQuestionResponse>>(
    'user/question/create',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params
    }
  )
