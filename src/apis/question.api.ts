import { QueryConfig } from '@/hooks/useQueryConfig'
import { CreateQuestionRequest, CreateQuestionResponse, Question } from '@/types/question.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestion = (params: QueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('question/list', {
    params
  })

export const createNewQuestion = (params: CreateQuestionRequest, file?: File) =>
  http.post<SuccessResponse<CreateQuestionResponse>>(
    'question/create',
    { file },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params
    }
  )
