import { useContext, useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { createSearchParams, useNavigate } from 'react-router-dom'

import path from '@/constants/path'
import { Conversation } from '@/types/conversation.type'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatHistoryConfig } from '@/types/params.type'
import { getChatHistory } from '@/apis/chat.api'
import { AppContext } from '@/contexts/app.context'
import { EllipsisIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TrashIcon } from '@radix-ui/react-icons'
import { deleteConversation } from '@/apis/conversation.api'
import { toast } from '@/hooks/use-toast'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'
import DialogConversationDetail from '@/components/dev/MessageItem/components/DialogConversationDetail'
import { ROLE } from '@/constants/role'

interface Props {
  readonly conversationIdActive?: number
  readonly conversation: Conversation
}

export default function MessageItem({ conversation, conversationIdActive }: Props) {
  const queryClient = useQueryClient()
  const { role } = useContext(AppContext)

  const conversationQueryParams = useConversationQueryConfig()
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

  const deleteConversationMutation = useMutation({
    mutationFn: (id: number) => deleteConversation(id)
  })

  const handleDeleteConversation = () => {
    deleteConversationMutation.mutate(conversation.id, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        queryClient.invalidateQueries({
          queryKey: ['conversations', conversationQueryParams]
        })
      }
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
      className={clsx('flex items-center w-full my-2 p-2 rounded-lg transition-all cursor-pointer', {
        'bg-secondary text-secondary-foreground': conversation.id === conversationIdActive,
        'hover:bg-secondary hover:text-secondary-foreground': conversation.id !== conversationIdActive
      })}
      onClick={handleNavigateToOtherMessage}
    >
      <AvatarCustom url={receiver?.avatarUrl} className='size-11' />
      <div className='w-[80%] ml-2'>
        <p className='font-bold truncate text-sm mb-1'>{conversation.isGroup ? conversation.name : receiver?.name}</p>
        {lastMessage && (
          <p className='text-xs truncate '>
            {lastChat?.recalledForEveryone ? 'Đã thu hồi một tin nhắn' : lastMessage} .{' '}
            <span className='text-xs text-foreground'>{elapsedTime}</span>
          </p>
        )}
      </div>
      <div className='flex items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisIcon className='size-5' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {role === ROLE.consultant && <DialogConversationDetail conversation={conversation} />}
            <div
              aria-hidden='true'
              className='text-sm text-destructive font-semibold cursor-pointer flex items-center px-2 py-1 hover:bg-secondary rounded transition-all'
              onClick={handleDeleteConversation}
            >
              <TrashIcon />
              <span className='ml-1'>Xóa đoạn chat</span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
