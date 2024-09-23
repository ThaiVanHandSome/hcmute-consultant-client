import useQueryParams from '@/hooks/useQueryParams'
import { QuestionListConfig } from '@/types/params.type'
import { isUndefined, omitBy } from 'lodash'

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
      endDate: queryParams.endDate
    },
    isUndefined
  ) as QuestionQueryConfig
  return queryConfig
}
