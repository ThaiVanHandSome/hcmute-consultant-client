import { ConversationQueryConfig } from '@/hooks/useConversationQueryConfig'
import { ConversationFormData, GroupConversationFormData } from '@/pages/User/Message/components/CreateNewConversation'
import { Conversation } from '@/types/conversation.type'
import { User } from '@/types/user.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'
import { omit } from 'lodash'

export const createUserConversation = (body: ConversationFormData) => {
  const newBody = omit(body, ['name'])
  return http.post<SuccessResponse<Conversation>>('user/conversation/create', newBody)
}

export const createGroupConversation = (body: GroupConversationFormData) =>
  http.post<SuccessResponse<string>>('consultant/conversation/create', body)

export const deleteConversation = (conversationId: number) =>
  http.delete<SuccessResponse<string>>('conversation/delete', {
    params: {
      conversationId
    }
  })

export const getConversations = (params: ConversationQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Conversation[]>>>('conversation/list', {
    params
  })

export const getUsers = () => http.get<SuccessResponse<User[]>>('conversation/list-users')

export const addUsersToGroup = (conversationId: number, body: { emailToApprove: string[] }) =>
  http.put<SuccessResponse<string>>('conversation/approve-member', body, {
    params: {
      conversationId
    }
  })

export const getMembers = (conversationId: number) =>
  http.get<SuccessResponse<User[]>>('conversation/list-member', {
    params: {
      conversationId
    }
  })

export const updateConversation = (conversationId: number, newName: string) =>
  http.put<SuccessResponse<string>>('conversation/update', null, {
    params: {
      conversationId,
      newName
    }
  })

export const removeMember = (conversationId: number, userIdToRemove: number) =>
  http.delete<SuccessResponse<string>>('conversation/remove-member', {
    params: {
      conversationId,
      userIdToRemove
    }
  })
