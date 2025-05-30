import { deleteForwardQuestion } from '@/apis/question.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import useForwardQuestionQueryConfig from '@/hooks/useForwardQuestionQueryConfig'
import { ForwardQuestion } from '@/types/question.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly forwardQuestion: ForwardQuestion
}

export default function DialogDeleteForwardQuestion({ children, forwardQuestion }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const forwardQuestionQueryConfig = useForwardQuestionQueryConfig()

  const deleteForwardQuestionMutation = useMutation({
    mutationFn: (id: number) => deleteForwardQuestion(id)
  })

  const handleDelete = () => {
    const id = forwardQuestion.id
    deleteForwardQuestionMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['forward-questions', forwardQuestionQueryConfig]
        })
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
          <p>Bạn chắc chắn muốn câu hỏi chuyển tiếp này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              isLoading={deleteForwardQuestionMutation.isPending}
              disabled={deleteForwardQuestionMutation.isPending}
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
