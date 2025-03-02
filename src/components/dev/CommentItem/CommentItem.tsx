import { replyComment, updateComment } from '@/apis/comment.api'
import { countLikeOfComment, getCommentRecord, getLikeUsersOfComment, likeComment, unLikeComment } from '@/apis/like.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import DialogDeleteComment from '@/components/dev/CommentItem/components/DialogDeleteComment'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form } from '@/components/ui/form'
import { AppContext } from '@/contexts/app.context'
import { Comment } from '@/types/comment.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { CheckCircle2Icon, EllipsisIcon, SendIcon, UsersIcon, ThumbsUpIcon } from 'lucide-react'
import { useContext, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { UserInfo } from '@/types/like.type'

interface Props {
  readonly comment: Comment
}

export default function CommentItem({ comment }: Props) {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      text: '',
      editText: ''
    }
  })

  const { user } = useContext(AppContext)
  const [showReply, setShowReply] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [showLikeUsers, setShowLikeUsers] = useState(false)

  const replyCommentMutation = useMutation({
    mutationFn: ({ commentFatherId, text }: { commentFatherId: number; text: string }) =>
      replyComment(commentFatherId, text)
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, text }: { commentId: number; text: string }) => updateComment(commentId, text)
  })

  const commentId = comment.id

  const { data: countLikes, refetch: refetchCountLikes } = useQuery({
    queryKey: ['count-like-of-comments', commentId],
    queryFn: () => countLikeOfComment(commentId),
    enabled: !!commentId
  })

  const { data: commentRecordRes, refetch: refetchCommentRecord } = useQuery({
    queryKey: ['comment-record', commentId],
    queryFn: () => getCommentRecord(commentId),
    enabled: !!commentId
  })
  const isLikedComment = useMemo(() => {
    const postRecord = commentRecordRes?.data.data
    return postRecord?.some((item) => item.likeKey.userId === user?.id) ?? false
  }, [commentRecordRes])

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => likeComment(commentId)
  })

  const unLikeCommentMutation = useMutation({
    mutationFn: (commentId: number) => unLikeComment(commentId)
  })

  const handleToggleLike = () => {
    if (!isLikedComment) {
      likeCommentMutation.mutate(commentId, {
        onSuccess: () => {
          refetchCountLikes()
          refetchCommentRecord()
        }
      })
      return
    }
    unLikeCommentMutation.mutate(commentId, {
      onSuccess: () => {
        refetchCountLikes()
        refetchCommentRecord()
      }
    })
  }

  const handleEditText = () => {
    setIsEdit(true)
    form.setValue('editText', comment.text)
  }

  const onSubmit = form.handleSubmit((values) => {
    const text = values.text
    const editText = values.editText
    if ((!isEdit && text.trim().length === 0) || (isEdit && editText.trim().length === 0)) return
    const commentFatherId: number = comment.id
    if (!isEdit) {
      replyCommentMutation.mutate(
        {
          commentFatherId,
          text
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['comments']
            })
            setShowReply(false)
          }
        }
      )
      return
    }
    updateCommentMutation.mutate(
      {
        commentId,
        text: editText
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['comments']
          })
          setIsEdit(false)
        }
      }
    )
  })

  const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  )

  const { data: likeUsersData, isLoading: isLoadingLikeUsers } = useQuery({
    queryKey: ['like-users-comment', commentId],
    queryFn: () => getLikeUsersOfComment(commentId),
    enabled: !!commentId && showLikeUsers
  })

  return (
    <div className='flex space-x-2 w-full mb-1'>
      <AvatarCustom url={comment.user.avatarUrl} className='size-8' />
      <div className='w-full'>
        <div className='flex items-center space-x-2 group'>
          {!isEdit && (
            <div className='rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 inline-block'>
              <p className='text-sm font-semibold'>
                {comment.user.lastName} {comment.user.firstName}
              </p>
              <p>{comment.text}</p>
            </div>
          )}
          {isEdit && (
            <div className='flex-1'>
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <div className='flex items-center space-x-2'>
                    <InputCustom control={form.control} name='editText' className='mb-0 flex-1' />
                    <Button>
                      <CheckCircle2Icon className='size-5' />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          {!isEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisIcon className='size-5 hidden group-hover:block' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div
                  aria-hidden='true'
                  onClick={handleEditText}
                  className='px-2 py-1 hover:bg-secondary hover:text-secondary-foreground cursor-pointer w-full text-sm'
                >
                  Chỉnh sửa
                </div>
                <DialogDeleteComment comment={comment} />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className='ml-4 mt-1 flex items-center space-x-2'>
          <p className='text-xs font-semibold'>{comment.create_date}</p>
          <div className='flex items-center space-x-4'>
            <div
              aria-hidden='true'
              className={clsx('text-xs font-bold cursor-pointer hover:underline', {
                'text-blue-600': isLikedComment
              })}
              onClick={handleToggleLike}
            >
              Thích
            </div>

            {!isEdit && (
              <div
                aria-hidden='true'
                className='text-xs font-bold cursor-pointer hover:underline'
                onClick={() => setShowReply((prev) => !prev)}
              >
                Phản hồi
              </div>
            )}
          </div>

          <div className='flex items-center space-x-4 text-sm text-gray-600'>
            <div className='flex items-center space-x-1.5'>
              <ThumbsUpIcon className='size-4' />
              <span>{countLikes?.data.data}</span>
            </div>
            
            <div 
              className='flex items-center space-x-1.5 cursor-pointer hover:text-blue-500 text-blue-400 border border-blue-200 px-2 py-1 rounded-md bg-blue-50'
              onClick={() => setShowLikeUsers(true)}
            >
              <UsersIcon className='size-4' />
              <span className="font-medium"></span>
            </div>
          </div>
        </div>

        {showReply && (
          <div className='mt-1 ml-6 relative'>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className='flex items-center space-x-2 w-full'>
                  <AvatarCustom url={user?.avatarUrl} className='size-8' />
                  <InputCustom control={form.control} name='text' className='mb-0 flex-1' />
                  <Button>
                    <SendIcon className='size-5' />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        <div className='mt-2'>
          {comment.childComments.map((childComment) => (
            <CommentItem key={childComment.id} comment={childComment} />
          ))}
        </div>
      </div>

      <Dialog open={showLikeUsers} onOpenChange={(open) => !open && setShowLikeUsers(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Người đã thích bình luận</DialogTitle>
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
            ) : likeUsersData?.data?.data && likeUsersData.data.data.length > 0 ? (
              <div className="space-y-3 p-2">
                {likeUsersData.data.data.map((user: UserInfo) => (
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