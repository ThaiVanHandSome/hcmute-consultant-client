export interface Comment {
  childComments: Comment[]
  text: string
  create_date: string
  parentCommentId: number
  id: number
  postId: number
  user: {
    id: number
    firstName: string
    lastName: string
    avatarUrl: string
  }
}
