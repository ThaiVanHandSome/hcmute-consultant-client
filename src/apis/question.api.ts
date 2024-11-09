import { CommonQuestionQueryConfig } from '@/hooks/useCommonQuestionQueryConfig'
import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import {
  Answer,
  CommonQuestion,
  CreateQuestionRequest,
  CreateQuestionResponse,
  DeletionLog,
  Question,
  QuestionStatus
} from '@/types/question.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestion = (params: QuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('list-question', {
    params
  })

export const getQuestions = (params: QuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('/question-answer/list', {
    params
  })

export const getQuestionById = (questionId: number) =>
  http.get<SuccessResponse<Question>>('question/detail', {
    params: {
      questionId
    }
  })

export const getCommonQuestion = () =>
  http.get<SuccessResponse<PaginationResponse<CommonQuestion[]>>>('list-common-question')

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

export const deleteQuestion = (id: number) =>
  http.delete<SuccessResponse<string>>('question/delete', {
    params: {
      id
    }
  })

export const deleteQuestionByConsultant = (questionId: number, reason: string) =>
  http.delete<SuccessResponse<string>>('question/delete', {
    params: {
      questionId,
      reason
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

export const getDeleteLog = (questionId: number) =>
  http.get<SuccessResponse<DeletionLog>>('deletion-log/detail', {
    params: {
      questionId
    }
  })

export const forwardQuestion = (body: { toDepartmentId: number; questionId: number; consultantId: number }) =>
  http.post<SuccessResponse<string>>('consultant/forward-question/forward', body)

export const getCommonQuestionAdvisor = (params: CommonQuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<CommonQuestion[]>>>('advisor-admin/list-common-question', {
    params
  })

export const deleteCommonQuestionAdvisor = (id: number) =>
  http.delete<SuccessResponse<CommonQuestion[]>>('advisor-admin/common-question/delete', {
    params: {
      id
    }
  })
