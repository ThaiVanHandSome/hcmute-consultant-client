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
    <Link to={path.messages} className='inline-block relative'>
      <ChatBubbleIcon className='size-6 text-foreground mr-6' />
      <p className='font-bold size-5 text-xs rounded-full bg-destructive text-destructive-foreground flex items-center justify-center absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2'>
        {conversations?.data.data?.content?.length ?? 0}
      </p>
    </Link>
  )
}
