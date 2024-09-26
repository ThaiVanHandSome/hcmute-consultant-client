import { Conversation, MemberConversation } from '@/types/conversation.type'

interface Props {
  readonly conversation: Conversation | undefined
  readonly sender: MemberConversation | undefined
  readonly receivers: MemberConversation[] | undefined
}

export default function ChatHeader({ conversation, sender, receivers }: Props) {
  return (
    <div>
      <div className='flex items-center py-2 shadow-lg px-3'>
        <img
          src={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0].avatarUrl}
          alt='avatar'
          className='size-10 rounded-full'
        />
        <div className='ml-2'>
          <p className='font-bold text-lg'>{conversation?.isGroup ? conversation.name : receivers?.[0].name}</p>
        </div>
      </div>
    </div>
  )
}