import { banUser } from '@/apis/user.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Question } from '@/types/question.type'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly question?: Question
}

export default function DialogBanUser({ children, question }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const banUserMutation = useMutation({
    mutationFn: (id: number) => banUser(id)
  })

  const handleBanUser = () => {
    const idUser = question?.askerId as number
    banUserMutation.mutate(idUser, {
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
          <DialogTitle>Xác nhận</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>Bạn chắc chắn muốn chặn người đặt câu hỏi này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              isLoading={banUserMutation.isPending}
              disabled={banUserMutation.isPending}
              variant='destructive'
              onClick={handleBanUser}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
