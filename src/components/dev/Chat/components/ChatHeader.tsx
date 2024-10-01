import AvatarCustom from '@/components/dev/AvatarCustom'
import { Conversation, MemberConversation } from '@/types/conversation.type'

interface Props {
  readonly conversation: Conversation | undefined
  readonly sender: MemberConversation | undefined
  readonly receivers: MemberConversation[] | undefined
}

export default function ChatHeader({ conversation, sender, receivers }: Props) {
  return (
    <div>
      <div className='flex items-center py-4 shadow-lg px-3'>
        <AvatarCustom url={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0]?.avatarUrl} className='size-10' />
        <div className='ml-2'>
          <p className='font-bold text-lg'>{conversation?.isGroup ? conversation?.name : receivers?.[0]?.name}</p>
        </div>
      </div>
    </div>
  )
}
