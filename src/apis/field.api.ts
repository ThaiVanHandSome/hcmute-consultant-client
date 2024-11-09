import { FieldQueryConfig } from '@/hooks/useFieldQueryConfig'
import { AdminField } from '@/types/field.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAdminField = (params: FieldQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<AdminField[]>>>('admin/field/list', {
    params
  })

export const addAdminField = (name: string, departmentId: string) =>
  http.post<SuccessResponse<string>>(
    'admin/field/create',
    {
      name
    },
    {
      params: {
        departmentId
      }
    }
  )

export const deleteAdminField = (id: number) =>
  http.delete<SuccessResponse<string>>('admin/field/delete', {
    params: {
      id
    }
  })
