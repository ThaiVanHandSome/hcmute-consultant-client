import { ConsultantRoleQueryConfig } from '@/hooks/useConsultantRoleQueryConfig'
import { RoleQueryConfig } from '@/hooks/useRoleQueryConfig'
import { ConsultantRoleType, RoleType } from '@/types/role.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAdminRole = (params: RoleQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<RoleType[]>>>('admin/role/list', {
    params
  })

export const createAdminRole = (name: string) =>
  http.post<SuccessResponse<string>>('admin/role/create', {
    name
  })

export const updateAdminRole = (id: number, name: string) =>
  http.put<SuccessResponse<string>>(
    'admin/role/update',
    {
      name
    },
    {
      params: {
        id
      }
    }
  )

export const deleteAdminRole = (id: number) =>
  http.delete<SuccessResponse<string>>('admin/role/delete', {
    params: {
      id
    }
  })

export const getAdminConsultantRole = (params: ConsultantRoleQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<ConsultantRoleType[]>>>('admin/role-consultant/list', {
    params
  })

export const createAdminConsultantRole = (roleId: string, name: string) =>
  http.post<SuccessResponse<string>>(
    'admin/role-consultant/create',
    {
      name
    },
    {
      params: {
        roleId
      }
    }
  )

export const deleteAdminConsultantRole = (id: number) =>
  http.delete<SuccessResponse<string>>('admin/role-consultant/delete', {
    params: {
      id
    }
  })

export const getAdminAskRole = (params: ConsultantRoleQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<ConsultantRoleType[]>>>('admin/role-ask/list', {
    params
  })

export const createAdminAskRole = (roleId: string, name: string) =>
  http.post<SuccessResponse<string>>('admin/role-ask/create', {
    name,
    roleId
  })

export const updateAdminAskRole = (id: number, name: string) =>
  http.put<SuccessResponse<string>>(
    'admin/role-ask/update',
    {
      name
    },
    {
      params: {
        id
      }
    }
  )

export const deleteAdminAskRole = (id: number) =>
  http.delete<SuccessResponse<string>>('admin/role-ask/delete', {
    params: {
      id
    }
  })
