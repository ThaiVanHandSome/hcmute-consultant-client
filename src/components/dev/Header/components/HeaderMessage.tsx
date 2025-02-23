import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getConversations } from '@/apis/conversation.api'
import path from '@/constants/path'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'

export default function HeaderMessage() {
  const conversationQueryParams = useConversationQueryConfig()
  const { data: conversations } = useQuery({
    queryKey: ['conversations', conversationQueryParams],
    queryFn: () => getConversations(conversationQueryParams)
  })

  return (
    <>
      <Link to={path.messages} className='hidden lg:inline-block relative'>
        <div className='relative cursor-pointer hover:opacity-70 transition-opacity'>
          <ChatBubbleIcon className='size-5 text-foreground' />
          <div className='absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center'>
            {conversations?.data.data?.content?.length ?? 0}
          </div>
        </div>
      </Link>
      <Link to={path.chats} className='inline-block lg:hidden relative'>
        <div className='relative cursor-pointer hover:opacity-70 transition-opacity'>
          <ChatBubbleIcon className='size-5 text-foreground' />
          <div className='absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center'>
            {conversations?.data.data?.content?.length ?? 0}
          </div>
        </div>
      </Link>
    </>
  )
}
