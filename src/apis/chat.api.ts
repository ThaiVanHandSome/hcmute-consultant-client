import { Chat } from '@/types/chat.type'
import { ChatHistoryConfig } from '@/types/params.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getChatHistory = (params: ChatHistoryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Chat[]>>>('chat/history', {
    params
  })