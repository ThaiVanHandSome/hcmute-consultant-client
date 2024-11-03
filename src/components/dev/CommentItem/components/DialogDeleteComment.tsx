import { deleteComment } from '@/apis/comment.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Comment } from '@/types/comment.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly comment: Comment
}

export default function DialogDeleteComment({ comment }: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId)
  })

  const handleDelete = () => {
    const commentId = comment.id
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['comments']
        })
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='w-full text-left'>
        <div className='px-2 py-1 hover:bg-secondary hover:text-secondary-foreground cursor-pointer w-full text-sm'>
          Delete
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <div>
          <p className='mb-3 text-destructive font-semibold'>Bạn chắc chắn muốn xóa bình luận này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleDelete}>Xóa</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
