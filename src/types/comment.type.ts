export interface Comment {
  child_comments: Comment[]
  comment: string
  create_date: string
  id_comment: number
  id_post: number
  id_user_comment: number
}
