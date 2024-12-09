import { CommonQuestionQueryConfig } from '@/hooks/useCommonQuestionQueryConfig'
import { ForwardQuestionQueryConfig } from '@/hooks/useForwardQuestionQueryConfig'
import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { CommonQuesionFormData } from '@/pages/Manage/ManageCommonQuestion/components/DialogCommonQuestion'
import { ForwardQuestionFormData } from '@/pages/Manage/ManageForwardQuestion/components/DialogForwardQuestion'
import {
  Answer,
  CommonQuestion,
  CreateQuestionRequest,
  CreateQuestionResponse,
  DeletionLog,
  ForwardQuestion,
  MyAnswer,
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

export const deleteQuestion = (questionId: number) =>
  http.delete<SuccessResponse<string>>('question/delete', {
    params: {
      questionId
    }
  })

export const deleteUserQuestion = (id: number) =>
  http.delete<SuccessResponse<string>>('user/question/delete', {
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

export const approvalAnswer = (questionId: number, content: string, file?: File) =>
  http.post<SuccessResponse<string>>(
    'advisor-admin/answer/review',
    {
      file
    },
    {
      params: {
        questionId,
        content
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

export const updateAdminCommonQuestion = (
  commonQuestionId: number,
  data: CommonQuesionFormData,
  file: File,
  fileAnswer: File
) =>
  http.patch<SuccessResponse<string>>(
    'advisor-admin/common-question/update',
    {
      file,
      fileAnswer
    },
    {
      params: {
        commonQuestionId,
        title: data.title,
        content: data.content,
        answerTitle: data.answerTitle,
        answerContent: data.answerContent
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

export const createAdminCommonQuestion = (data: CommonQuesionFormData, file: File, fileAnswer: File) =>
  http.post<SuccessResponse<string>>(
    'advisor-admin/common-question/create',
    {
      file,
      fileAnswer
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        title: data.title,
        content: data.content,
        answerTitle: data.answerTitle,
        answerContent: data.answerContent
      }
    }
  )

export const updateAnswer = (params: MyAnswer, file: File) =>
  http.put<SuccessResponse<string>>(
    'answer/update',
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

export const deleteAnswer = (id: number) =>
  http.delete<SuccessResponse<string>>('answer/delete', {
    params: {
      id
    }
  })

export const getForwardQuestion = (params: ForwardQuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<ForwardQuestion[]>>>('/forward-question/list', {
    params
  })

export const updateForwardQuestion = (body: ForwardQuestionFormData, forwardQuestionId: number) =>
  http.put<SuccessResponse<string>>('forward-question/update', body, {
    params: {
      forwardQuestionId
    }
  })

export const deleteForwardQuestion = (forwardQuestionId: number) =>
  http.delete<SuccessResponse<string>>('forward-question/delete', {
    params: {
      forwardQuestionId
    }
  })

export const checkLike = (questionId: number) =>
  http.post<SuccessResponse<string>>('like/question/check', null, {
    params: {
      questionId
    }
  })

export const getLikeCount = (questionId: number) =>
  http.get<SuccessResponse<number>>('like-count/question', {
    params: {
      questionId
    }
  })

export const likeQuestion = (questionId: number) =>
  http.post<SuccessResponse<string>>('like/question', null, {
    params: {
      questionId
    }
  })

export const unlikeQuestion = (questionId: number) =>
  http.delete<SuccessResponse<string>>('unlike/question', {
    params: {
      questionId
    }
  })

export const convertToCommonQuestion = (questionId: number) =>
  http.post<SuccessResponse<string>>('advisor-admin/common-question/convert-to-common', null, {
    params: {
      questionId
    }
  })
