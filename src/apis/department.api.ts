import { DepartmentQueryConfig } from '@/hooks/useDepartmentQueryConfig'
import { AdminDepartment, Department } from '@/types/department.type'
import { Field } from '@/types/field.type'
import { RoleAsk } from '@/types/roleAsk.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllDepartments = () => http.get<SuccessResponse<Department[]>>('list-department')

export const getFields = (departmentId: number) =>
  http.get<SuccessResponse<Field[]>>('list-field-by-department', {
    params: {
      departmentId
    }
  })

export const getRolesAsk = () => http.get<SuccessResponse<RoleAsk[]>>('user/question/role-ask')

export const getAdminDepartment = (params: DepartmentQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<AdminDepartment[]>>>('admin/department/list', {
    params
  })

export const addAdminDepartment = (body: { name: string; description: string; logo: string }) =>
  http.post<SuccessResponse<string>>('admin/department/create', body)

export const updateAdminDepartment = (id: number, body: { name: string; description: string; logo: string }) =>
  http.put<SuccessResponse<string>>('admin/department/update', body, {
    params: {
      id
    }
  })

export const deleteAdminDepartment = (id: number) =>
  http.delete<SuccessResponse<string>>('admin/department/delete', {
    params: {
      id
    }
  })
