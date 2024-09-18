import useQueryParams from '@/hooks/useQueryParams'
import { QuestionListConfig } from '@/types/question.type'
import { isUndefined, omitBy } from 'lodash'

export type QueryConfig = {
  [key in keyof QuestionListConfig]: string
}
export default function () {
  const queryParams = useQueryParams() as Partial<QueryConfig>
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'title',
      sortDir: queryParams.sortDir ?? 'asc',
      departmentId: queryParams.departmentId,
      status: queryParams.status,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate
    },
    isUndefined
  ) as QueryConfig
  return queryConfig
}
