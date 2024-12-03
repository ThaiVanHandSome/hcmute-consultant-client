import { getConversations } from '@/apis/conversation.api'
import MessageItem from '@/components/dev/MessageItem'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'
import CreateNewConversation from '@/pages/User/Message/components/CreateNewConversation'
import { Conversation } from '@/types/conversation.type'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function Chats() {
  const conversationQueryParams = useConversationQueryConfig()
  const [searchText, setSearchText] = useState<string>('')

  const { data: conversations } = useQuery({
    queryKey: ['conversations', conversationQueryParams],
    queryFn: () => getConversations(conversationQueryParams)
  })
  const navigate = useNavigate()
  const handleSearch = () => {
    if (!searchText.trim()) return
    navigate({
      pathname: path.chats,
      search: createSearchParams({
        ...conversationQueryParams,
        name: searchText
      }).toString()
    })
  }
  return (
    <div className='px-4 border-r flex flex-col h-remain-screen'>
      <h1 className='font-semibold text-xl mb-2 text-primary flex items-center pt-3'>
        <MessageCircleIcon />
        <span className='ml-1'>Nhắn tin</span>
      </h1>
      <div className='flex items-center'>
        <div className='flex items-center w-full border rounded-md px-4 py-1 flex-1'>
          <div className='flex-1 flex-shrink-0'>
            <input
              value={searchText}
              placeholder='Tìm kiếm'
              className='focus:outline-none focus:border-none text-sm w-full bg-background text-foreground'
              onChange={(e) => setSearchText((e.target as HTMLInputElement)?.value)}
            />
          </div>
          <MagnifyingGlassIcon className='size-7 text-foreground cursor-pointer' onClick={handleSearch} />
        </div>
        <CreateNewConversation conversationQueryParams={conversationQueryParams} />
      </div>
      <Separator className='mt-4' />
      <div className='mt-3 flex-grow overflow-y-auto h-full'>
        {conversations?.data.data?.content.map((conversation: Conversation) => (
          <MessageItem key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  )
}
