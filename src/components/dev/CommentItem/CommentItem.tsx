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
import { CheckCircle2Icon, EllipsisIcon, SendIcon } from 'lucide-react'
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
            <img
              height='18'
              role='presentation'
              src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
              width='18'
            ></img>
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
