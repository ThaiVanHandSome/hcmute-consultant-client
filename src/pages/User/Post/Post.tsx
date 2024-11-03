import { createComment, getComments } from '@/apis/comment.api'
import { countLikeOfPost, getPostRecord, likePost, unLikePost } from '@/apis/like.api'
import { getPostDetail, getPosts } from '@/apis/post.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import CommentItem from '@/components/dev/CommentItem'
import InputCustom from '@/components/dev/Form/InputCustom'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import QuestionImage from '@/components/dev/QuestionImage'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { AppContext } from '@/contexts/app.context'
import usePostQueryConfig from '@/hooks/usePostQueryConfig'
import { isImageFile } from '@/utils/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { MessageCircleIcon, SendIcon, ThumbsUp } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useParams } from 'react-router-dom'

export default function Post() {
  const form = useForm({
    defaultValues: {
      comment: ''
    }
  })
  const { user } = useContext(AppContext)
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

  return (
    <div className='h-remain-screen grid grid-cols-12'>
      <div className='col-span-4 px-3 py-1 border-r bg-background'>
        <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
        {posts?.data.data.content.map((post) => (
          <Link
            key={post.id}
            to={{
              pathname: `/posts/${post.id}`,
              search: createSearchParams(postQueryConfig).toString()
            }}
            className={clsx('flex mb-3 px-2 py-1 hover:transition-all cursor-pointer rounded-md w-full', {
              'hover:bg-secondary hover:text-secondary-foreground': id !== post.id,
              'bg-secondary text-secondary-foreground': id === post.id
            })}
          >
            {isImageFile(post.fileName) && (
              <div className='w-16 h-16 mr-2'>
                <img src={post.fileName} alt='consult' className='object-fill w-full h-full block rounded-md' />
              </div>
            )}
            <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{post.title}</p>
          </Link>
        ))}
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
      <div className='col-span-8'>
        <div className='px-2 py-3 flex items-center justify-between shadow-md'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <AvatarCustom url={post?.avatarUrl} />
              <p className='text-sm font-semibold'>{post?.name}</p>
            </div>
            <div>
              <p className='text-xs italic'>{post?.createdAt}</p>
            </div>
          </div>
          <div className='flex items-center space-x-1'>
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
        <div className='bg-background'>
          <div className='px-4 py-2 min-h-2'>
            <p>{post?.title}</p>
            <div dangerouslySetInnerHTML={{ __html: post?.content as string }} className='mb-2'></div>
            <QuestionImage url={post?.fileName as string} />
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
