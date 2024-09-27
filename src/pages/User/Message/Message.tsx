import { getConversations } from '@/apis/conversation.api'
import Chat from '@/components/dev/Chat'
import MessageItem from '@/components/dev/MessageItem'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'
import useQueryParams from '@/hooks/useQueryParams'
import CreateNewConversation from '@/pages/User/Message/components/CreateNewConversation'
import { Conversation } from '@/types/conversation.type'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { MessageCircleIcon } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function Message() {
  const { role } = useContext(AppContext)
  const { id } = useQueryParams()
  const navigate = useNavigate()
  const conversationQueryParams = useConversationQueryConfig()
  const [conversationActive, setConversationActive] = useState<Conversation>()

  const { data: conversations } = useQuery({
    queryKey: ['conversations', conversationQueryParams],
    queryFn: () => getConversations(conversationQueryParams)
  })

  // when access to component, choose the first conversation and show it
  useEffect(() => {
    if (!conversations || id) return
    const data = conversations.data.data.content
    if (data.length !== 0) {
      navigate({
        pathname: path.messages,
        search: createSearchParams({
          id: String(data[0].id)
        }).toString()
      })
    }
  }, [conversations, id, navigate])

  // handle when user choose other conversation
  useEffect(() => {
    if (!conversations) return
    const data = conversations.data.data.content
    const conversationActive = data.find((obj) => obj.id === parseInt(id))
    setConversationActive(conversationActive as Conversation)
  }, [conversations, id])

  return (
    <div className='bg-white'>
      <div className='grid grid-cols-12'>
        <div className='col-span-4 px-4 border-r border-gray-300 flex flex-col h-remain-screen'>
          <h1 className='font-semibold text-xl mb-2 text-primary flex items-center pt-3'>
            <MessageCircleIcon />
            <span className='ml-1'>Nhắn tin</span>
          </h1>
          <div className='flex items-center'>
            <div className='flex items-center w-full border border-gray-200 rounded-md px-4 py-1 flex-1'>
              <div className='flex-1 flex-shrink-0'>
                <input placeholder='Tìm kiếm' className='focus:outline-none focus:border-none text-sm w-full' />
              </div>
              <MagnifyingGlassIcon className='size-7 text-gray-400 cursor-pointer' />
            </div>
            {role === ROLE.user && <CreateNewConversation conversationQueryParams={conversationQueryParams} />}
          </div>
          <Separator className='mt-4' />
          <div className='mt-3 flex-grow overflow-y-auto h-full px-4'>
            {conversations?.data.data.content.map((conversation: Conversation) => (
              <MessageItem
                key={conversation.id}
                conversation={conversation}
                conversationIdActive={conversationActive?.id}
              />
            ))}
          </div>
        </div>
        <div className='col-span-8'>
          <Chat conversation={conversationActive} />
        </div>
      </div>
    </div>
  )
}
