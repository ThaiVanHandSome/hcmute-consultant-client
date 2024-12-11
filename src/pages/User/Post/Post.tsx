import { createComment, getComments } from '@/apis/comment.api'
import { countLikeOfPost, getPostRecord, likePost, unLikePost } from '@/apis/like.api'
import { approvePost, deletePost, getPostDetail, getPosts } from '@/apis/post.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import CommentItem from '@/components/dev/CommentItem'
import FileShow from '@/components/dev/FileShow'
import InputCustom from '@/components/dev/Form/InputCustom'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import PostItem from '@/pages/User/Post/components/PostItem'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { MessageCircleIcon, SendIcon, ThumbsUp } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

export default function Post() {
  const form = useForm({
    defaultValues: {
      comment: ''
    }
  })
  const { user, role } = useContext(AppContext)
  let postQueryConfig = usePostQueryConfig()
  postQueryConfig = {
    ...postQueryConfig,
    isApproved: String(true)
  }
  const params = useParams()
  const id = parseInt(params.id as string)

  const { data: posts } = useQuery({
    queryKey: ['posts', postQueryConfig],
    queryFn: () => getPosts(postQueryConfig)
  })

  const { data: postRes } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id),
    enabled: !!id
  })
  const post = postRes?.data.data

  const { data: comments, refetch } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id),
    enabled: !!id
  })

  const { data: countLikes, refetch: refetchCountLikes } = useQuery({
    queryKey: ['count-like-of-posts', id],
    queryFn: () => countLikeOfPost(id),
    enabled: !!id
  })

  const { data: postRecordRes, refetch: refetchPostRecord } = useQuery({
    queryKey: ['post-record', id],
    queryFn: () => getPostRecord(id),
    enabled: !!id
  })

  const isLikedPost = useMemo(() => {
    const postRecord = postRecordRes?.data.data
    return postRecord?.some((item) => item.likeKey.userId === user?.id) ?? false
  }, [postRecordRes])

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, text }: { postId: number; text: string }) => createComment(postId, text)
  })

  const likePostMutation = useMutation({
    mutationFn: (postId: number) => likePost(postId)
  })

  const unLikePostMutation = useMutation({
    mutationFn: (postId: number) => unLikePost(postId)
  })

  const handleTogglePost = () => {
    if (!isLikedPost) {
      likePostMutation.mutate(id, {
        onSuccess: () => {
          refetchCountLikes()
          refetchPostRecord()
        }
      })
      return
    }
    unLikePostMutation.mutate(id, {
      onSuccess: () => {
        refetchCountLikes()
        refetchPostRecord()
      }
    })
  }

  const onSubmit = form.handleSubmit((values) => {
    const text = values.comment
    if (text.trim().length === 0) return
    createCommentMutation.mutate(
      {
        postId: id,
        text
      },
      {
        onSuccess: () => {
          refetch()
          form.reset({
            comment: ''
          })
        }
      }
    )
  })

  const approvePostMutation = useMutation({
    mutationFn: (id: number) => approvePost(id)
  })

  const handleApprove = () => {
    const id = post?.id
    if (!id) return
    approvePostMutation.mutate(id, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
      }
    })
  }

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => deletePost(id)
  })

  const handleDelete = () => {
    const id = post?.id
    if (!id) return
    deletePostMutation.mutate(id, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
      }
    })
  }

  return (
    <div className='h-remain-screen grid grid-cols-12'>
      <div className='hidden lg:block col-span-4 px-3 py-1 border-r bg-background'>
        <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
        {posts?.data.data.content.map((post) => <PostItem post={post} postQueryConfig={postQueryConfig} />)}
        <Separator className='my-2' />
        <div>
          <Paginate
            path={`/posts/${id}`}
            queryConfig={postQueryConfig}
            pageSize={posts?.data.data.totalPages as number}
            RANGE={1}
            showChooseQuantity={false}
          />
        </div>
      </div>
      <div className='col-span-12 lg:col-span-8'>
        <div className='px-2 py-3 flex items-center justify-between shadow-md'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <AvatarCustom url={post?.avatarUrl} />
              <p className='text-sm font-semibold'>{post?.name}</p>
            </div>
            <div>
              <p className='text-xs italic'>{post?.createdAt}</p>
            </div>
            {role === ROLE.admin && post?.approved && <Badge>Đã phê duyệt</Badge>}
            {role === ROLE.admin && !post?.approved && <Badge variant='destructive'>Chưa phê duyệt</Badge>}
          </div>
          <div className='flex items-center space-x-3'>
            {role === ROLE.admin && !post?.approved && (
              <Button
                disabled={approvePostMutation.isPending}
                isLoading={approvePostMutation.isPending}
                onClick={handleApprove}
              >
                Phê duyệt
              </Button>
            )}
            {role === ROLE.admin && (
              <Button
                variant='destructive'
                disabled={deletePostMutation.isPending}
                isLoading={deletePostMutation.isPending}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            )}
            <div className='flex items-center space-x-1 cursor-pointer'>
              <ThumbsUp
                className={clsx('size-5', {
                  'fill-primary text-background': isLikedPost,
                  'fill-none text-primary': !isLikedPost
                })}
                strokeWidth='0.4'
                onClick={handleTogglePost}
              />
              <span className='font-semibold text-sm'>{countLikes?.data?.data ?? '0'}</span>
            </div>
          </div>
        </div>
        <div className='bg-background'>
          <div className='px-4 py-2 min-h-2'>
            <p>{post?.title}</p>
            <div dangerouslySetInnerHTML={{ __html: post?.content as string }} className='mb-2'></div>
            {post?.fileName && <FileShow url={post.fileName} />}
          </div>
          <div className='px-3 py-1 space-y-2'>
            <div className='flex items-center space-x-1'>
              <MessageCircleIcon className='size-4' />
              <p className='font-semibold'>Bình luận</p>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <div className='flex items-center space-x-2'>
                    <AvatarCustom url={user?.avatarUrl} className='size-8' />
                    <InputCustom
                      control={form.control}
                      name='comment'
                      placeholder='Bình luận'
                      className='mb-0 flex-1'
                    />
                    <Button>
                      <SendIcon className='size-5' />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <Separator className='my-4' />
            <div>{comments?.data.data.map((comment) => <CommentItem key={comment.id} comment={comment} />)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
