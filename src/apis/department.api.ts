import { Department } from '@/types/department.type'
import { Field } from '@/types/field.type'
import { RoleAsk } from '@/types/roleAsk.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllDepartments = () => http.get<SuccessResponse<Department[]>>('list-department')

export const getFields = (departmentId: number) =>
  http.get<SuccessResponse<Field[]>>('list-field-by-department', {
    params: {
      departmentId
    }
  })

export const getRolesAsk = () => http.get<SuccessResponse<RoleAsk[]>>('user/question/role-ask')
