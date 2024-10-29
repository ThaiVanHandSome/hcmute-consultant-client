import { updateConversation } from '@/apis/conversation.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { Conversation } from '@/types/conversation.type'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly conversation: Conversation
}

export default function DialogUpdateConversation({ conversation }: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(conversation.name)

  const updateConversationMutation = useMutation({
    mutationFn: ({ conversationId, newName }: { conversationId: number; newName: string }) =>
      updateConversation(conversationId, newName)
  })

  const handleUpdateConversation = () => {
    if (newName.trim().length === 0) return
    const conversationId = conversation.id
    updateConversationMutation.mutate(
      { conversationId, newName },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          setOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['conversations']
          })
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='size-9 flex items-center justify-center rounded-full hover:bg-secondary cursor-pointer'>
          <Pencil1Icon className='size-4 text-secondary-foreground' />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đoạn chat</DialogTitle>
        </DialogHeader>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Nhập tên nhóm' />
        <Button
          disabled={updateConversationMutation.isPending}
          isLoading={updateConversationMutation.isPending}
          onClick={handleUpdateConversation}
        >
          Lưu
        </Button>
      </DialogContent>
    </Dialog>
  )
}
