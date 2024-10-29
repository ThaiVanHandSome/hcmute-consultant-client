import { getMembers, removeMember } from '@/apis/conversation.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import DialogAddMember from '@/components/dev/MessageItem/components/DialogAddMember'
import DialogUpdateConversation from '@/components/dev/MessageItem/components/DialogUpdateConversation'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Conversation } from '@/types/conversation.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'

interface Props {
  readonly conversation: Conversation
}

export default function DialogConversationDetail({ conversation }: Props) {
  const conversationId = conversation.id
  const { data: members, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: () => getMembers(conversationId),
    enabled: !!conversationId
  })

  const removeMemberMutation = useMutation({
    mutationFn: ({ conversationId, userIdToRemove }: { conversationId: number; userIdToRemove: number }) =>
      removeMember(conversationId, userIdToRemove)
  })

  const handleRemoveMember = (userIdToRemove: number) => {
    removeMemberMutation.mutate(
      {
        conversationId,
        userIdToRemove
      },
      {
        onSuccess: () => {
          refetch()
        }
      }
    )
  }

  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <div className='text-sm font-semibold cursor-pointer flex items-center px-2 py-1 hover:bg-secondary rounded transition-all'>
          <span className='ml-1'>Chi tiết</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đoạn chat</DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <div className='flex items-center justify-between'>
              <p className='font-bold'>{conversation.name}</p>
              <div className='flex items-center space-x-2'>
                <DialogUpdateConversation conversation={conversation} />
                <DialogAddMember conversation={conversation} />
              </div>
            </div>
            <Separator className='my-2' />
            <Badge className='mb-1'>Thành viên</Badge>
            {members?.data.data.map((member) => (
              <div key={member.id} className='flex items-center justify-between py-2'>
                <div className='flex items-center justify-center space-x-1'>
                  <AvatarCustom url={member.avatarUrl} />
                  <p className='text-sm font-semibold'>{member.name}</p>
                </div>
                <TrashIcon className='cursor-pointer text-destructive' onClick={() => handleRemoveMember(member.id)} />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
