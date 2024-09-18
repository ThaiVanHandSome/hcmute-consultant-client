import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { CreateQuestionRequest, CreateQuestionResponse, Question, QuestionStatus } from '@/types/question.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestion = (params: QuestionQueryConfig) =>
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

export const getAllQuestionStatus = () => http.get<SuccessResponse<QuestionStatus[]>>('list-filter-status-options')
