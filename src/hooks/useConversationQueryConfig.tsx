import useQueryParams from '@/hooks/useQueryParams'
import { ConversationListConfig } from '@/types/conversation.type'
import { isUndefined, omitBy } from 'lodash'

export type ConversationQueryConfig = {
  [key in keyof ConversationListConfig]: string
}

export default function useConversationQueryConfig() {
  const queryParams = useQueryParams() as Partial<ConversationQueryConfig>
  const conversationQueryConfiger: ConversationQueryConfig = omitBy(
    {
      page: queryParams.page ?? '0',
      size: queryParams.size ?? '20',
      sortBy: queryParams.sortBy ?? 'createdAt',
      sortDir: queryParams.sortDir ?? 'desc',
      name: queryParams.name
    },
    isUndefined
  ) as ConversationQueryConfig
  return conversationQueryConfiger
}
