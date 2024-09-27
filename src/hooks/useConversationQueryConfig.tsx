import { isUndefined, omitBy } from 'lodash'

import useQueryParams from '@/hooks/useQueryParams'
import { ConversationListConfig } from '@/types/params.type'

export type ConversationQueryConfig = {
  [key in keyof ConversationListConfig]: string
}

export default function useConversationQueryConfig() {
  const queryParams = useQueryParams() as Partial<ConversationQueryConfig>
  const conversationQueryConfiger: ConversationQueryConfig = omitBy(
    {
      page: '0',
      size: '20',
      sortBy: 'createdAt',
      sortDir: 'desc',
      name: queryParams.name
    },
    isUndefined
  ) as ConversationQueryConfig
  return conversationQueryConfiger
}
