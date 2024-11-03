import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { WardListConfig } from '@/types/params.type'

export type WardQueryConfig = {
  [key in keyof WardListConfig]: string
}
export default function useWardQueryConfig() {
  const queryParams = useQueryParams() as Partial<WardQueryConfig>
  const wardQueryConfig: WardQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? '',
      sortDir: queryParams.sortDir ?? 'desc',
      districtCode: queryParams.districtCode ?? '282'
    },
    isUndefined
  ) as WardQueryConfig
  return wardQueryConfig
}
