import { deleteAnswer } from '@/apis/question.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Question } from '@/types/question.type'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly question: Question
  readonly refetch: any
}
export default function DialogDeleteAnswer({ children, question, refetch }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const deleteAnswerMutation = useMutation({
    mutationFn: (id: number) => deleteAnswer(id)
  })

  const handleDelete = () => {
    const id = question.answerId
    deleteAnswerMutation.mutate(id, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setOpen(false)
        refetch()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>Bạn chắc chắn muốn câu trả lời này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              isLoading={deleteAnswerMutation.isPending}
              disabled={deleteAnswerMutation.isPending}
              variant='destructive'
              onClick={handleDelete}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
