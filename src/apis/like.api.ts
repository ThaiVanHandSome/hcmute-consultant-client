import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const likePost = (postId: number) =>
  http.post<SuccessResponse<string>>('like/post', null, {
    params: {
      postId
    }
  })

export const likeComment = (commentId: number) =>
  http.post<SuccessResponse<string>>('like/comment', null, {
    params: {
      commentId
    }
  })

export const countLikeOfPost = (postId: number) =>
  http.get<SuccessResponse<number>>('like-count/post', {
    params: {
      postId
    }
  })

export const countLikeOfComment = (commentId: number) =>
  http.get<SuccessResponse<number>>('like-count/comment', {
    params: {
      commentId
    }
  })

export const getPostRecord = (postId: number) =>
  http.get<SuccessResponse<{ likeKey: { targetId: number; userId: number; type: string } }[]>>('like-records/post', {
    params: {
      postId
    }
  })

export const getCommentRecord = (commentId: number) =>
  http.get<SuccessResponse<{ likeKey: { targetId: number; userId: number; type: string } }[]>>('like-records/comment', {
    params: {
      commentId
    }
  })

export const unLikePost = (postId: number) =>
  http.delete<SuccessResponse<string>>('unlike/post', {
    params: {
      postId
    }
  })

export const unLikeComment = (commentId: number) =>
  http.delete<SuccessResponse<string>>('unlike/comment', {
    params: {
      commentId
    }
  })
