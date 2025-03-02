import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'
import { UserInfo } from '@/types/like.type'

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

export const likeQuestion = (questionId: number) =>
  http.post<SuccessResponse<string>>('like/question', null, {
    params: { questionId }
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

export const countLikeOfQuestion = (questionId: number) =>
  http.get<SuccessResponse<number>>('like-count/question', {
    params: { questionId }
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

export const getQuestionRecord = (questionId: number) =>
  http.get<SuccessResponse<{ likeKey: { targetId: number; userId: number; type: string } }[]>>('like-records/question', {
    params: {
      questionId
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

export const unLikeQuestion = (questionId: number) =>
  http.delete<SuccessResponse<string>>('unlike/question', {
    params: { questionId }
  })

export const getLikeUsersOfPost = (postId: number) =>
  http.get<SuccessResponse<UserInfo[]>>('like-users/post', {
    params: {
      postId
    }
  })

export const getLikeUsersOfComment = (commentId: number) =>
  http.get<SuccessResponse<UserInfo[]>>('like-users/comment', {
    params: {
      commentId
    }
  })

export const getLikeUsersOfQuestion = (questionId: number) =>
  http.get<SuccessResponse<UserInfo[]>>('like-users/question', {
    params: { questionId }
  })
