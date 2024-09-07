import { Department } from '@/types/department.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getAllDepartments = () => http.get<SuccessResponse<Department[]>>('department/departments')
