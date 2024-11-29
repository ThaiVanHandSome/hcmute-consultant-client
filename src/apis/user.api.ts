import { ConsultationQueryConfig } from '@/hooks/useConsultationQueryConfig'
import { SchedualQueryConfig } from '@/hooks/useSchedualQueryConfig'
import { UserQueryConfig } from '@/hooks/useUserQueryConfig'
import { ConsultantSchedualFormData } from '@/pages/User/SchedualConsultant/SchedualConsultant'
import { ConsultationType, SchedualConsultant } from '@/types/consultant.type'
import { AdminUser, User, UserDetail, UserUpdate } from '@/types/user.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

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

export const getScheduals = (params: SchedualQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<SchedualConsultant[]>>>('consultation-schedule/list', {
    params
  })

export const getAdminUser = (params: UserQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<AdminUser[]>>>('admin/account/list', {
    params
  })

export const getUserDetail = (id: number) =>
  http.get<SuccessResponse<UserDetail>>('admin/user-information/detail', {
    params: {
      id
    }
  })

export const getConsultationJoin = (params: ConsultationQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<ConsultationType[]>>>('/user/consultation-schedule/list-join', {
    params
  })
