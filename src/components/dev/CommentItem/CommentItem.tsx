import { replyComment } from '@/apis/comment.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AppContext } from '@/contexts/app.context'
import { Comment } from '@/types/comment.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  readonly comment: Comment
}

export default function CommentItem({ comment }: Props) {
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      text: ''
    }
  })
  const { user } = useContext(AppContext)
  const [showReply, setShowReply] = useState<boolean>(false)

  const replyCommentMutation = useMutation({
    mutationFn: ({ commentFatherId, text }: { commentFatherId: number; text: string }) =>
      replyComment(commentFatherId, text)
  })

  const onSubmit = form.handleSubmit((values) => {
    const text = values.text
    if (text.trim().length === 0) return
    const commentFatherId: number = comment.id_comment
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
  })

  return (
    <div className='flex space-x-2 w-full mb-1'>
      <AvatarCustom url={user?.avatarUrl} className='size-8' />
      <div className='w-full'>
        <div className='rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 inline-block'>
          <p className='text-sm font-semibold'>
            {user?.lastName} {user?.firstName}
          </p>
          <p>{comment.comment}</p>
        </div>
        <div className='ml-4 mt-1 flex items-center space-x-2'>
          <p className='text-xs font-semibold'>{comment.create_date}</p>
          <div
            aria-hidden='true'
            className='text-xs font-bold cursor-pointer hover:underline'
            onClick={() => setShowReply((prev) => !prev)}
          >
            Phản hồi
          </div>
        </div>

        {showReply && (
          <div className='mt-2 ml-6 relative'>
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
          {comment.child_comments.map((childComment) => (
            <CommentItem key={childComment.id_comment} comment={childComment} />
          ))}
        </div>
      </div>
    </div>
  )
}
