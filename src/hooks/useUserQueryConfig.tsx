import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { UserListConfig } from '@/types/params.type'

export type UserQueryConfig = {
  [key in keyof UserListConfig]: string
}
export default function useUserQueryConfig() {
  const queryParams = useQueryParams() as Partial<UserQueryConfig>
  const userQueryConfig: UserQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '5',
      sortBy: queryParams.sortBy ?? 'createdAt',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name,
      email: queryParams.email,
      isActivity: queryParams.isActivity,
      isOnline: queryParams.isOnline
    },
    isUndefined
  ) as UserQueryConfig
  return userQueryConfig
}
