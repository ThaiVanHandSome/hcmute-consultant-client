import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { ForwardQuestionListConfig } from '@/types/params.type'

export type ForwardQuestionQueryConfig = {
  [key in keyof ForwardQuestionListConfig]: string
}
export default function useForwardQuestionQueryConfig() {
  const queryParams = useQueryParams() as Partial<ForwardQuestionQueryConfig>

  const queryConfig: ForwardQuestionQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'title',
      sortDir: queryParams.sortDir ?? 'desc',
      title: queryParams?.title,
      startDate: queryParams?.startDate,
      endDate: queryParams.endDate
    },
    isUndefined
  ) as ForwardQuestionQueryConfig
  return queryConfig
}
