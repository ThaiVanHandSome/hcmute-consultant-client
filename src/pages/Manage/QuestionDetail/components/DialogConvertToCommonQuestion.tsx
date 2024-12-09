import { convertToCommonQuestion } from '@/apis/question.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Question } from '@/types/question.type'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly question?: Question
}

export default function DialogConvertToCommonQuestion({ children, question }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const convertToCommonQuestionMutation = useMutation({
    mutationFn: (questionId: number) => convertToCommonQuestion(questionId)
  })

  const handleConvert = () => {
    const questionId = question?.id
    if (!questionId) return
    convertToCommonQuestionMutation.mutate(questionId, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển thành câu hỏi chung</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>Bạn chắc chắn muốn chuyển câu hỏi này thành câu hỏi chung?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              disabled={convertToCommonQuestionMutation.isPending}
              isLoading={convertToCommonQuestionMutation.isPending}
              onClick={handleConvert}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
