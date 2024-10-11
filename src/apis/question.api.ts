import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { Answer, CreateQuestionRequest, CreateQuestionResponse, Question, QuestionStatus } from '@/types/question.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestion = (params: QuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('list-question', {
    params
  })

export const getQuestionByConsultant = (params: QuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('consultant/question-answer/list', {
    params
  })

export const getQuestionById = (questionId: number) =>
  http.get<SuccessResponse<Question>>('consultant/question/detail', {
    params: {
      questionId
    }
  })

export const getCommonQuestion = () => http.get<SuccessResponse<PaginationResponse<Question[]>>>('list-common-question')

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

export const updateQuestion = (questionId: number, params: CreateQuestionRequest, file?: File) =>
  http.put<SuccessResponse<string>>(
    'user/question/update',
    {
      file
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        questionId,
        ...params
      }
    }
  )

export const getAllQuestionStatus = () => http.get<SuccessResponse<QuestionStatus[]>>('list-filter-status-options')

export const deleteUserQuestion = (id: number) =>
  http.delete<SuccessResponse<string>>('user/question/delete', {
    params: {
      id
    }
  })

export const answerTheQuestion = (params: Answer, file: File) =>
  http.post<SuccessResponse<string>>(
    'consultant/answer/create',
    {
      file
    },
    {
      params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
