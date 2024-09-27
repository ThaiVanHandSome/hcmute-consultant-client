import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { ConsultantListConfig } from '@/types/params.type'

export type ConsultantQueryConfig = {
  [key in keyof ConsultantListConfig]: string
}
export default function useConsultantQueryConfig() {
  const queryParams = useQueryParams() as Partial<ConsultantQueryConfig>
  const consultantQueryConfig: ConsultantQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'firstName',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name,
      departmentId: queryParams.departmentId
    },
    isUndefined
  ) as ConsultantQueryConfig
  return consultantQueryConfig
}
