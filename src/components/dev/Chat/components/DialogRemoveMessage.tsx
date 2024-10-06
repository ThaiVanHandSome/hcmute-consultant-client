import { recallMessage } from '@/apis/chat.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly messageId: number
}

export default function DialogRemoveMessage({ messageId }: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)

  const recallMessageSelfMutation = useMutation({
    mutationFn: (messageId: number) => recallMessage(messageId)
  })

  const handleRemoveMessage = () => {
    recallMessageSelfMutation.mutate(messageId, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ['chat-history']
        })
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='w-full px-2 py-1 text-sm  cursor-pointer'>Xóa tin nhắn</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa tin nhắn</DialogTitle>
        </DialogHeader>
        <p>Tin nhắn này sẽ bị xóa vĩnh viễn khỏi thiết bị của bạn</p>
        <div className='flex items-center gap-4'>
          <Button variant='destructive' onClick={handleRemoveMessage}>
            Xóa
          </Button>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
