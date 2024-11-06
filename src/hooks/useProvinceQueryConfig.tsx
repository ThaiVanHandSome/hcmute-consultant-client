import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { PaginationConfig } from '@/types/params.type'

export type ProvinceQueryConfig = {
  [key in keyof PaginationConfig]: string
}
export default function useProvinceQueryConfig() {
  const queryParams = useQueryParams() as Partial<ProvinceQueryConfig>
  const provinceQueryConfig: ProvinceQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? '',
      sortDir: queryParams.sortDir ?? 'desc'
    },
    isUndefined
  ) as ProvinceQueryConfig
  return provinceQueryConfig
}
