import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { CommonQuestionListConfig } from '@/types/params.type'

export type CommonQuestionQueryConfig = {
  [key in keyof CommonQuestionListConfig]: string
}
export default function useCommonQuestionQueryConfig() {
  const queryParams = useQueryParams() as Partial<CommonQuestionQueryConfig>
  const commonQuestionQueryConfig: CommonQuestionQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'createdAt',
      sortDir: queryParams.sortDir ?? 'desc',
      title: queryParams.title
    },
    isUndefined
  ) as CommonQuestionQueryConfig
  return commonQuestionQueryConfig
}
