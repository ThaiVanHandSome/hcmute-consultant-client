import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { DistrictListConfig } from '@/types/params.type'

export type DistrictQueryConfig = {
  [key in keyof DistrictListConfig]: string
}
export default function useDistrictQueryConfig() {
  const queryParams = useQueryParams() as Partial<DistrictQueryConfig>
  const districtQueryConfig: DistrictQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? '',
      sortDir: queryParams.sortDir ?? 'desc',
      provinceCode: queryParams.provinceCode
    },
    isUndefined
  ) as DistrictQueryConfig
  return districtQueryConfig
}
