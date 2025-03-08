import { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { CreateScheduleFormData } from '@/pages/Manage/ManageSchedual/components/DialogCreateSchedule'
import { MemberJoin } from '@/pages/Manage/SchedualDetail/components/DialogListMemberJoin'
import { RatingFormData } from '@/pages/User/ConsultantEvaluation/ConsultantEvaluation'
import { Consultant, SchedualConfirm, SchedualConsultant } from '@/types/consultant.type'
import { Rating, RatingQueryConfig } from '@/types/rating.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllConsultant = (params: ConsultantQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Consultant[]>>>('list-consultant', {
    params
  })

export const getConsultantsByDepartment = (departmentId: string) =>
  http.get<SuccessResponse<Consultant[]>>('list-consultant-by-department', {
    params: {
      departmentId
    }
  })

export const createRating = (body: RatingFormData) =>
  http.post<SuccessResponse<RatingFormData>>('user/rating/create', body)

export const getAllRating = (params: RatingQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Rating[]>>>('rating/list', {
    params
  })

export const getRatingById = (id: string) =>
  http.get<SuccessResponse<Rating>>('rating/detail', {
    params: {
      id
    }
  })

export const getPastRating = (consultantId: string) =>
  http.get<SuccessResponse<Rating>>('list-consultant-rating-by-department', {
    params: {
      consultantId
    }
  })

export const getTeacherConsultantsByDepartment = (departmentId: number) =>
  http.get<SuccessResponse<Consultant[]>>('list-consultant-teacher-by-department', {
    params: {
      departmentId
    }
  })

export const getSchedualById = (scheduleId: number) =>
  http.get<SuccessResponse<SchedualConsultant>>('consultation-schedule/detail', {
    params: {
      scheduleId
    }
  })

export const confirmSchedual = (scheduleId: number, body: SchedualConfirm) =>
  http.post<SuccessResponse<string>>('consultant/consultation-schedule/confirm', body, {
    params: {
      scheduleId
    }
  })

export const createSchedule = (body: CreateScheduleFormData) =>
  http.post<SuccessResponse<string>>('advisor-admin/consultation-schedule/create', body)

export const getScheduleDetail = (scheduleId: number) =>
  http.get<SuccessResponse<SchedualConsultant>>('consultation-schedule/detail', {
    params: {
      scheduleId
    }
  })

export const joinSchedule = (scheduleId: number) =>
  http.post<SuccessResponse<string>>('user/consultation-schedule/join', null, {
    params: {
      scheduleId
    }
  })

export const checkJoinConsultation = (scheduleId: number) =>
  http.post<SuccessResponse<string>>('user/consultation-schedule/check', null, {
    params: {
      scheduleId
    }
  })

export const cancelConsultation = (scheduleId: number) =>
  http.post<SuccessResponse<string>>('user/consultation-schedule/cancel', null, {
    params: {
      scheduleId
    }
  })

export const deleteSchedual = (scheduleId: number) =>
  http.delete<SuccessResponse<string>>('consultation-schedule/delete', {
    params: {
      scheduleId
    }
  })

export const listMemberJoin = (consultationScheduleId: number) =>
  http.get<SuccessResponse<PaginationResponse<MemberJoin[]>>>('advisor-admin/consultation-schedule/list-member-join', {
    params: {
      consultationScheduleId
    }
  })
