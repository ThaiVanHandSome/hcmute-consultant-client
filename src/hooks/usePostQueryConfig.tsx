import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { PostListConfig } from '@/types/params.type'

export type PostQueryConfig = {
  [key in keyof PostListConfig]: string
}
export default function usePostQueryConfig() {
  const queryParams = useQueryParams() as Partial<PostQueryConfig>
  const postQueryConfig: PostQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'createdAt',
      sortDir: queryParams.sortDir ?? 'desc',
      isApproved: queryParams.isApproved ?? true
    },
    isUndefined
  ) as PostQueryConfig
  return postQueryConfig
}
