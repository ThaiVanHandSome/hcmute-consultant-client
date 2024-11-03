import { deleteCommonQuestionAdvisor } from '@/apis/question.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import useCommonQuestionQueryConfig from '@/hooks/useCommonQuestionQueryConfig'
import { CommonQuestion } from '@/types/question.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly children?: React.ReactNode
  readonly question: CommonQuestion
}

export default function DialogDeleteCommonQuestion({ children, question }: Props) {
  const queryClient = useQueryClient()
  const commonQuestionQueryConfig = useCommonQuestionQueryConfig()
  const [open, setOpen] = useState<boolean>(false)

  const deleteCommonQuestion = useMutation({
    mutationFn: (commonQuestionId: number) => deleteCommonQuestionAdvisor(commonQuestionId)
  })

  const handleDelete = () => {
    deleteCommonQuestion.mutate(question.commonQuestionId, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['common-questions', commonQuestionQueryConfig]
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
          <p>Bạn chắc chắn muốn xóa câu hỏi chung này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
