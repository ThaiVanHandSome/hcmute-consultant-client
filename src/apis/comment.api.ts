import { Comment } from '@/types/comment.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const createComment = (postId: number, text: string) =>
  http.post<SuccessResponse<string>>('comment/create', null, {
    params: {
      postId,
      text
    }
  })

export const updateComment = (commentId: number, text: string) =>
  http.put<SuccessResponse<string>>('comment/update', null, {
    params: {
      commentId,
      text
    }
  })

export const getComments = (postId: number) =>
  http.get<SuccessResponse<Comment[]>>('comment/get-comment-by-post', {
    params: {
      postId
    }
  })

export const replyComment = (commentFatherId: number, text: string) =>
  http.post<SuccessResponse<string>>('comment/reply', null, {
    params: {
      commentFatherId,
      text
    }
  })

export const deleteComment = (commentId: number) =>
  http.delete<SuccessResponse<string>>('comment/delete', {
    params: {
      commentId
    }
  })
