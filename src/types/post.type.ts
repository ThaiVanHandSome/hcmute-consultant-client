export interface PostRequest {
  content: string
  title: string
  file: string | File
  anonymous: boolean
}

export interface Post {
  id: number
  anonymous: boolean
  approved: boolean
  content: string
  createdAt: string
  fileName: string
  title: string
  userId: number
  views: number
  name: string
  avatarUrl: string
}
