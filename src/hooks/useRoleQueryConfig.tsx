import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { RoleListConfig } from '@/types/params.type'

export type RoleQueryConfig = {
  [key in keyof RoleListConfig]: string
}
export default function useRoleQueryConfig() {
  const queryParams = useQueryParams() as Partial<RoleQueryConfig>
  const roleQueryConfig: RoleQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? '',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name
    },
    isUndefined
  ) as RoleQueryConfig
  return roleQueryConfig
}
