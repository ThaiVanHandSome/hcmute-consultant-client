import { ConversationQueryConfig } from '@/hooks/useConversationQueryConfig'
import { UserConversationFormData } from '@/pages/User/Message/Message'
import { Conversation } from '@/types/conversation.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createUserConversation = (body: UserConversationFormData) =>
  http.post<SuccessResponse<Conversation>>('user/conversation/create', body)

export const getUserConversation = (params: ConversationQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Conversation[]>>>('user/conversation/list', {
    params
  })
