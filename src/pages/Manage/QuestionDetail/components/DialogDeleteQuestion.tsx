import { deleteQuestionByConsultant } from '@/apis/question.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { TrashIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  readonly questionId: number
}

export default function DialogDeleteQuestion({ questionId }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [reason, setReason] = useState<string>('')

  const navigate = useNavigate()

  const deleteQuestionMutation = useMutation({
    mutationFn: ({ questionId, reason }: { questionId: number; reason: string }) =>
      deleteQuestionByConsultant(questionId, reason)
  })

  const handleDeleteQuestion = () => {
    if (reason.trim().length === 0) return
    deleteQuestionMutation.mutate(
      { questionId, reason },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          setOpen(false)
          navigate(path.manageQuestion)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='destructive' className='space-x-1'>
          <TrashIcon />
          Xóa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <p>Lý do xóa câu hỏi</p>
        <Input placeholder='Lý do' value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className='space-x-2'>
          <Button
            disabled={deleteQuestionMutation.isPending}
            isLoading={deleteQuestionMutation.isPending}
            onClick={handleDeleteQuestion}
          >
            Xác nhận
          </Button>
          <Button variant='secondary' onClick={() => setOpen(false)}>
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
