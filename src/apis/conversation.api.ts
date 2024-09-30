import { ROLE } from '@/constants/role'
import { ConversationQueryConfig } from '@/hooks/useConversationQueryConfig'
import { UserConversationFormData } from '@/pages/User/Message/components/CreateNewConversation'
import { Conversation } from '@/types/conversation.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import { getRoleFromLocalStorage } from '@/utils/auth'
import http from '@/utils/http'

export const createUserConversation = (body: UserConversationFormData) =>
  http.post<SuccessResponse<Conversation>>('user/conversation/create', body)

export const deleteUserConversation = (conversationId: number) =>
  http.delete<SuccessResponse<string>>('user/conversation/delete', {
    params: {
      conversationId
    }
  })

export const getUserConversation = (params: ConversationQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Conversation[]>>>('user/conversation/list', {
    params
  })

export const getConsultantConversation = (params: ConversationQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Conversation[]>>>('consultant/conversation/list', { params })

export const getConversations = (params: ConversationQueryConfig) => {
  const role = getRoleFromLocalStorage()
  if (role === ROLE.user) {
    return http.get<SuccessResponse<PaginationResponse<Conversation[]>>>('user/conversation/list', {
      params
    })
  }
  return http.get<SuccessResponse<PaginationResponse<Conversation[]>>>('consultant/conversation/list', { params })
}
