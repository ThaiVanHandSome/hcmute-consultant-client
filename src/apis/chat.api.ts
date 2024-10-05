import { Chat } from '@/types/chat.type'
import { ChatHistoryConfig } from '@/types/params.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getChatHistory = (params: ChatHistoryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Chat[]>>>('chat/history', {
    params
  })

export const updateMessage = (messageId: number, newContent: string) =>
  http.post<SuccessResponse<string>>('update-message', null, {
    params: {
      messageId,
      newContent
    }
  })

export const recallMessage = (messageId: number) =>
  http.post<SuccessResponse<string>>('recall-message-self', null, {
    params: {
      messageId
    }
  })

export const recallMessageAll = (messageId: number) =>
  http.post<SuccessResponse<string>>('recall-message-all', null, {
    params: {
      messageId
    }
  })
