import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { ConsultantRoleListConfig } from '@/types/params.type'

export type ConsultantRoleQueryConfig = {
  [key in keyof ConsultantRoleListConfig]: string
}
export default function useConsultantRoleQueryConfig() {
  const queryParams = useQueryParams() as Partial<ConsultantRoleQueryConfig>
  const consultantRoleQueryConfig: ConsultantRoleQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? '',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name,
      roleId: queryParams.roleId
    },
    isUndefined
  ) as ConsultantRoleQueryConfig
  return consultantRoleQueryConfig
}
