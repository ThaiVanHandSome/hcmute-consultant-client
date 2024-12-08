import { deleteSchedual } from '@/apis/consultant.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { SchedualConsultant } from '@/types/consultant.type'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  readonly children?: React.ReactNode
  readonly schedual?: SchedualConsultant
}

export default function DialogDeleteSchedual({ children, schedual }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  const deleteSchedualMutation = useMutation({
    mutationFn: (scheduleId: number) => deleteSchedual(scheduleId)
  })

  const navigate = useNavigate()
  const handleDelete = () => {
    const schedualId = schedual?.id as number
    deleteSchedualMutation.mutate(schedualId, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
        setOpen(false)
        navigate(path.manageSchedule)
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
          <p>Bạn chắc chắn muốn lịch tư vấn/buổi tư vấn này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              disabled={deleteSchedualMutation.isPending}
              isLoading={deleteSchedualMutation.isPending}
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
