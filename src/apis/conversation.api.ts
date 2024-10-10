import { ROLE } from '@/constants/role'
import { ConversationQueryConfig } from '@/hooks/useConversationQueryConfig'
import { ConversationFormData } from '@/pages/User/Message/components/CreateNewConversation'
import { Conversation } from '@/types/conversation.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import { getRoleFromLocalStorage } from '@/utils/auth'
import http from '@/utils/http'
import { omit } from 'lodash'

export const createUserConversation = (body: ConversationFormData) => {
  const newBody = omit(body, ['name'])
  return http.post<SuccessResponse<Conversation>>('user/conversation/create', newBody)
}

export const createGroupConversation = (body: ConversationFormData) =>
  http.post<SuccessResponse<string>>('consultant/conversation/create', body)

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
