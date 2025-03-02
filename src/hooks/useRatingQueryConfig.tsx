import useQueryParams from './useQueryParams'
import { RatingQueryConfig } from '@/types/rating.type'
import { isUndefined, omitBy } from 'lodash'

export default function useRatingQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig: RatingQueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '10',
      fromDate: queryParams.fromDate,
      toDate: queryParams.toDate
    },
    isUndefined
  )
  return queryConfig
} 