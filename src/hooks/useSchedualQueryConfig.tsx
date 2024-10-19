import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { SchedualListConfig } from '@/types/params.type'

export type SchedualQueryConfig = {
  [key in keyof SchedualListConfig]: string
}
export default function useSchedualQueryConfig() {
  const queryParams = useQueryParams() as Partial<SchedualQueryConfig>

  const queryConfig: SchedualQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'title',
      sortDir: queryParams.sortDir ?? 'desc',
      title: queryParams?.title,
      departmentId: queryParams?.departmentId,
      startDate: queryParams?.startDate,
      endDate: queryParams.endDate,
      statusPublic: queryParams.statusPublic,
      statusConfirmed: queryParams.statusConfirmed,
      mode: queryParams.mode
    },
    isUndefined
  ) as SchedualQueryConfig
  return queryConfig
}
