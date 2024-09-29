import { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { SchedualQueryConfig } from '@/hooks/useSchedualQueryConfig'
import { ConsultantSchedualFormData } from '@/pages/User/SchedualConsultant/SchedualConsultant'
import { SchedualConsultant } from '@/types/consultant.type'
import { Question } from '@/types/question.type'
import { User, UserUpdate } from '@/types/user.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllQuestionsOfUser = (params: QuestionQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Question[]>>>('user/question/list', {
    params
  })

export const getProfile = () => http.get<SuccessResponse<User>>('profile')

export const updateProfile = (params: UserUpdate, file?: File) =>
  http.put<SuccessResponse<User>>(
    'profile/update',
    {
      file
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params
    }
  )

export const createUserConsultant = (body: ConsultantSchedualFormData) =>
  http.post<SuccessResponse<string>>('user/consultation-schedule/create', body)

export const getAllUserConsultant = (params: SchedualQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<SchedualConsultant>>>('user/consultation-schedule/list', {
    params
  })
