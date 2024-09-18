import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { Question } from '@/types/question.type'
import { User } from '@/types/user.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestionsOfUser = (params: QuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('user/question/list', {
    params
  })

export const getProfile = () => http.get<SuccessResponse<User>>('profile')

export const updateProfile = (body: Omit<User, 'id'>) => http.put<SuccessResponse<String>>('profile/update', body)
