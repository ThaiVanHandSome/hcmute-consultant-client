import { PostQueryConfig } from '@/hooks/usePostQueryConfig'
import { Post, PostRequest } from '@/types/post.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getPosts = (params: PostQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Post[]>>>('post/list', {
    params
  })

export const createPost = (body: PostRequest) =>
  http.post<SuccessResponse<string>>('post', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

export const getPostDetail = (id: number) =>
  http.get<SuccessResponse<Post>>('post/detail', {
    params: {
      id
    }
  })
