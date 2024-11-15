import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { QuestionListConfig } from '@/types/params.type'

export type QuestionQueryConfig = {
  [key in keyof QuestionListConfig]: string
}
export default function useQuestionQueryConfig() {
  const queryParams = useQueryParams() as Partial<QuestionQueryConfig>
  const queryConfig: QuestionQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'createdAt',
      sortDir: queryParams.sortDir ?? 'desc',
      title: queryParams.title,
      departmentId: queryParams.departmentId,
      status: queryParams.status,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      statusApproval: queryParams.statusApproval ?? 'false'
    },
    isUndefined
  ) as QuestionQueryConfig
  return queryConfig
}
