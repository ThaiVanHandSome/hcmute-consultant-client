import useQueryParams from '@/hooks/useQueryParams'
import { RatingListConfig } from '@/types/params.type'
import { isUndefined, omitBy } from 'lodash'

export type RatingQueryConfig = {
  [key in keyof RatingListConfig]: string
}
export default function useRatingQueryConfig() {
  const queryParams = useQueryParams() as Partial<RatingQueryConfig>

  const queryConfig: RatingQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'submittedAt',
      sortDir: queryParams.sortDir ?? 'desc',
      consultantName: queryParams?.consultantName,
      departmentId: queryParams?.departmentId,
      startDate: queryParams?.startDate,
      endDate: queryParams.endDate
    },
    isUndefined
  ) as RatingQueryConfig
  return queryConfig
}
