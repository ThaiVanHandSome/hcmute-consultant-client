import { createComment, getComments } from '@/apis/comment.api'
import { countLikeOfPost, getLikeUsersOfPost, getPostRecord, likePost, unLikePost } from '@/apis/like.api'
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
import { MessageCircleIcon, SendIcon, ThumbsUp, UsersIcon } from 'lucide-react'
import { useContext, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { UserInfo } from '@/types/like.type'

// Simple Skeleton component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
)

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
  const [showLikeUsers, setShowLikeUsers] = useState(false)
  const [errorLoadingUsers] = useState(false)

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

  // Fetch và quản lý danh sách người thích
  const { data: likeUsersData, isLoading: isLoadingLikeUsers } = useQuery({
    queryKey: ['like-users-post', id],
    queryFn: () => getLikeUsersOfPost(id),
    enabled: !!id && showLikeUsers,
    retry: 0
  });
  
  // Lấy trực tiếp từ response của API đúng
  const likeUsers = likeUsersData?.data?.data || [];

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

  // Xử lý đóng modal người thích
  const handleDialogOpenChange = (open: boolean) => {
    setShowLikeUsers(open);
  }

  return (
    <div className='h-remain-screen grid grid-cols-12'>
      <div className='hidden lg:block col-span-4 px-3 py-1 border-r bg-background'>
        <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các bài đăng</div>
        {posts?.data.data.content.map((post) => (
          <PostItem key={post.id} activeId={id} post={post} postQueryConfig={postQueryConfig} />
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
                  'text-primary': isLikedPost,
                  'text-black': !isLikedPost
                })}
                strokeWidth='1.25'
                onClick={handleTogglePost}
              />
              <span className='font-semibold text-sm'>{countLikes?.data?.data ?? '0'}</span>
              
              {/* Thêm nút "" */}
              {(countLikes?.data?.data ?? 0) > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1 ml-2 text-blue-500 hover:bg-blue-50"
                  onClick={() => setShowLikeUsers(true)}
                >
                  <UsersIcon className="h-4 w-4" />
                  <span className="text-xs"></span>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className='bg-background'>
          <div className='px-4 py-2 min-h-2'>
            <p className='font-semibold text-2xl mb-2'>{post?.title}</p>
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

      {/* Dialog hiển thị danh sách người thích */}
      <Dialog open={showLikeUsers} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Người đã thích bài viết</DialogTitle>
            <DialogDescription>
              Danh sách những người đã thích bài viết này
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[300px] overflow-y-auto">
            {isLoadingLikeUsers ? (
              <div className="space-y-3 p-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : errorLoadingUsers ? (
              <div className="py-8 text-center">
                <p className="text-red-500 mb-2">Không thể tải danh sách người thích</p>
                <p className="text-sm text-gray-500 mb-3">Server đang gặp vấn đề với dữ liệu người dùng (lỗi vòng lặp vô hạn).</p>
                <div className="border border-amber-200 bg-amber-50 p-3 rounded-md text-sm">
                  <p className="font-medium text-amber-700 mb-1">Thông tin cho kỹ thuật viên:</p>
                  <p className="text-xs text-amber-800 font-mono mb-1">Backend gặp vấn đề infinite recursion trong UserInformationEntity</p>
                  <p className="text-xs text-amber-600">Cần thêm @JsonIgnore hoặc @JsonManagedReference/@JsonBackReference vào các mối quan hệ entity</p>
                </div>
              </div>
            ) : likeUsers && likeUsers.length > 0 ? (
              <div className="space-y-3 p-2">
                {likeUsers.map((user: UserInfo) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{`${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${user.lastName || ''} ${user.firstName || ''}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Không có thông tin người thích
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}