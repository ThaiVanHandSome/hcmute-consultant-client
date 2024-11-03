import { replyComment, updateComment } from '@/apis/comment.api'
import { countLikeOfComment, getCommentRecord, likeComment, unLikeComment } from '@/apis/like.api'
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
import { CheckCircle2Icon, EllipsisIcon, SendIcon, ThumbsUpIcon } from 'lucide-react'
import { useContext, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

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

  return (
    <div className='flex space-x-2 w-full mb-1'>
      <AvatarCustom url={comment.user.avatarUrl} className='size-8' />
      <div className='w-full'>
        <div className='flex items-center space-x-2 group'>
          {!isEdit && (
            <div className='rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 inline-block'>
              <p className='text-sm font-semibold'>{comment.user.name}</p>
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
                  Edit
                </div>
                <DialogDeleteComment comment={comment} />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className='ml-4 mt-1 flex items-center space-x-2'>
          <p className='text-xs font-semibold'>{comment.create_date}</p>
          <div
            aria-hidden='true'
            className={clsx('text-xs font-bold cursor-pointer hover:underline', {
              'text-primary': isLikedComment
            })}
            onClick={handleToggleLike}
          >
            Like
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
          <div className='flex items-center space-x-1'>
            <ThumbsUpIcon className='fill-primary text-primary-bg size-4' strokeWidth={1} />
            <span className='font-semibold text-xs'>{countLikes?.data.data}</span>
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
    </div>
  )
}
