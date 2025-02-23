import AvatarCustom from '@/components/dev/AvatarCustom'
import { Conversation, MemberConversation } from '@/types/conversation.type'

interface Props {
  readonly conversation: Conversation | undefined
  readonly sender: MemberConversation | undefined
  readonly receivers: MemberConversation[] | undefined
}

export default function ChatHeader({ conversation, sender, receivers }: Props) {
  return (
    <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm'>
      <div className='flex items-center py-3 px-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200'>
        <div className='relative'>
          <AvatarCustom
            url={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0]?.avatarUrl}
            className='size-11 ring-2 ring-gray-100 hover:ring-primary/20 transition-all duration-300'
          />
          {conversation?.isGroup && (
            <div className='absolute -bottom-1 -right-1 size-4 bg-primary rounded-full border-2 border-white' />
          )}
        </div>

        <div className='ml-3 flex-1'>
          <p className='font-semibold text-gray-800 line-clamp-1'>
            {conversation?.isGroup ? conversation?.name : receivers?.[0]?.name}
          </p>
          {conversation?.isGroup && (
            <p className='text-xs text-gray-500 mt-0.5'>{conversation.members.length} thành viên</p>
          )}
        </div>
      </div>
    </div>
  )
}
