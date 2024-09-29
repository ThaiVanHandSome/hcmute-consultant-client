import { useContext, useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { createSearchParams, useNavigate } from 'react-router-dom'

import path from '@/constants/path'
import { Conversation } from '@/types/conversation.type'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { useQuery } from '@tanstack/react-query'
import { ChatHistoryConfig } from '@/types/params.type'
import { getChatHistory } from '@/apis/chat.api'
import { AppContext } from '@/contexts/app.context'

interface Props {
  readonly conversationIdActive?: number
  readonly conversation: Conversation
}

export default function MessageItem({ conversation, conversationIdActive }: Props) {
  const chatHistoryQueryConfig: ChatHistoryConfig = {
    conversationId: conversation?.id,
    page: 0,
    size: 1000,
    sortBy: '',
    sortDir: 'asc'
  }

  const receiver = useMemo(() => {
    return conversation?.members.find((member) => member.sender === false)
  }, [conversation])

  const navigate = useNavigate()
  const { user } = useContext(AppContext)

  const conversationId = conversation?.id
  const { data: chatHistory } = useQuery({
    queryKey: ['chat-history', chatHistoryQueryConfig],
    queryFn: () => getChatHistory(chatHistoryQueryConfig),
    enabled: !!conversationId
  })
  const chats = chatHistory?.data.data.content

  const lastChat = chats?.[chats?.length - 1]
  const lastMessage = lastChat?.sender.id === user?.id ? `Bạn: ${lastChat?.message}` : lastChat?.message

  // switch to other conversation
  const handleNavigateToOtherMessage = () => {
    if (conversationIdActive === conversation.id) return
    navigate({
      pathname: path.messages,
      search: createSearchParams({
        id: String(conversation.id)
      }).toString()
    })
  }

  const [elapsedTime, setElapsedTime] = useState<string>('')
  const calculateTimeDifference = () => {
    if (lastChat?.date) {
      const now = new Date().getTime()
      const sentTime = new Date(lastChat.date).getTime()
      const diffInMinutes = Math.floor((now - sentTime) / (1000 * 60))

      if (diffInMinutes < 1) {
        setElapsedTime('Vừa gửi')
      } else if (diffInMinutes < 60) {
        setElapsedTime(`${diffInMinutes} phút trước`)
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60)
        setElapsedTime(`${diffInHours} giờ trước`)
      }
    }
  }

  useEffect(() => {
    calculateTimeDifference()
    const intervalId = setInterval(() => {
      calculateTimeDifference()
    }, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [lastChat])
  return (
    <div
      aria-hidden='true'
      className={clsx('flex w-full my-2 p-2 rounded-lg transition-all cursor-pointer', {
        'bg-gray-200': conversation.id === conversationIdActive,
        'hover:bg-slate-100': conversation.id !== conversationIdActive
      })}
      onClick={handleNavigateToOtherMessage}
    >
      <AvatarCustom url={receiver?.avatarUrl} className='size-11' />
      <div className='w-[80%] ml-2'>
        <p className='font-bold truncate text-sm mb-1'>{receiver?.name}</p>
        {lastMessage && (
          <p className='text-xs truncate '>
            {lastMessage} . <span className='text-xs text-gray-400'>{elapsedTime}</span>
          </p>
        )}
      </div>
    </div>
  )
}
