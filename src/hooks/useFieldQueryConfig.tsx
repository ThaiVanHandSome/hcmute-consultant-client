import useQueryParams from '@/hooks/useQueryParams'
import { FieldListConfig } from '@/types/params.type'
import { isUndefined, omitBy } from 'lodash'

export type FieldQueryConfig = {
  [key in keyof FieldListConfig]: string
}

export default function useFieldQueryConfig() {
  const queryParams = useQueryParams() as Partial<FieldQueryConfig>
  const fieldQueryConfig: FieldQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'createdAt',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name,
      departmentId: queryParams.departmentId
    },
    isUndefined
  ) as FieldQueryConfig
  return fieldQueryConfig
}
