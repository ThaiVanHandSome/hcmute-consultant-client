import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { DepartmentListConfig } from '@/types/params.type'

export type DepartmentQueryConfig = {
  [key in keyof DepartmentListConfig]: string
}
export default function useDepartmentQueryConfig() {
  const queryParams = useQueryParams() as Partial<DepartmentQueryConfig>
  const departmentQueryConfig: DepartmentQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? '',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name
    },
    isUndefined
  ) as DepartmentQueryConfig
  return departmentQueryConfig
}
