import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { ConsultationListConfig } from '@/types/params.type'

export type ConsultationQueryConfig = {
  [key in keyof ConsultationListConfig]: string
}
export default function useConsultationQueryConfig() {
  const queryParams = useQueryParams() as Partial<ConsultationQueryConfig>

  const queryConfig: ConsultationQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'registeredAt',
      sortDir: queryParams.sortDir ?? 'desc',
      startDate: queryParams?.startDate,
      endDate: queryParams.endDate
    },
    isUndefined
  ) as ConsultationQueryConfig
  return queryConfig
}
