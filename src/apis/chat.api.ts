import { Chat } from '@/types/chat.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getChatHistory = (conversationId: number) =>
  http.get<SuccessResponse<PaginationResponse<Chat[]>>>('chat/history', {
    params: {
      conversationId
    }
  })
