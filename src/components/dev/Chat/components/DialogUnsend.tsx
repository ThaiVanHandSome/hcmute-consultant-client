import { recallMessage, recallMessageAll } from '@/apis/chat.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly messageId: number
}

export default function DialogUnsend({ messageId }: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const [option, setOption] = useState<string>('mine')

  const recallMessageSelfMutation = useMutation({
    mutationFn: (messageId: number) => recallMessage(messageId)
  })

  const recallMessageAllMutation = useMutation({
    mutationFn: (messageId: number) => recallMessageAll(messageId)
  })

  const handleRecallMessage = () => {
    if (option === 'mine') {
      recallMessageSelfMutation.mutate(messageId, {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ['chat-history']
          })
        }
      })
    } else if (option === 'all') {
      recallMessageAllMutation.mutate(messageId, {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ['chat-history']
          })
        }
      })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='w-full px-2 py-1 text-sm  cursor-pointer'>Thu hồi</div>
      </DialogTrigger>
      <DialogContent aria-describedby='undefined'>
        <DialogHeader>
          <DialogTitle>Thu hồi tin nhắn</DialogTitle>
        </DialogHeader>
        <RadioGroup onValueChange={setOption} defaultValue={option}>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='mine' id='option-one' />
            <Label htmlFor='option-one'>Thu hồi tin nhắn với bạn</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='all' id='option-two' />
            <Label htmlFor='option-two'>Thu hồi tin nhắn với tất cả mọi người</Label>
          </div>
        </RadioGroup>
        <Button
          disabled={recallMessageSelfMutation.isPending || recallMessageAllMutation.isPending}
          isLoading={recallMessageSelfMutation.isPending || recallMessageAllMutation.isPending}
          className='w-full mt-4'
          onClick={handleRecallMessage}
        >
          Thu hồi
        </Button>
      </DialogContent>
    </Dialog>
  )
}
