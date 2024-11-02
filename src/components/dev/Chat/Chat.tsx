import { useEffect, useMemo, useRef, useState } from 'react'

import { Client, over } from 'stompjs'
import SockJS from 'sockjs-client'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Conversation, MemberConversation } from '@/types/conversation.type'
import { getChatHistory, updateMessage } from '@/apis/chat.api'
import { ChatHistoryConfig } from '@/types/params.type'
import ChatInput from '@/components/dev/Chat/components/ChatInput'
import ChatHistory from '@/components/dev/Chat/components/ChatHistory'
import ChatHeader from '@/components/dev/Chat/components/ChatHeader'

interface Props {
  readonly conversation: Conversation | undefined
}

export default function Chat({ conversation }: Props) {
  const isGroup = conversation?.isGroup

  const chatHistoryQueryConfig: ChatHistoryConfig = {
    conversationId: conversation?.id as number,
    page: 0,
    size: 1000,
    sortBy: '',
    sortDir: 'asc'
  }
  const stompClient = useRef<Client | null>(null)

  const sender: MemberConversation | undefined = useMemo(() => {
    return conversation?.members.find((member) => member.sender === true)
  }, [conversation])

  const receivers: MemberConversation[] | undefined = useMemo(() => {
    return conversation?.members.filter((member) => member.sender === false)
  }, [conversation])

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [messageEdit, setMessageEdit] = useState<{
    messageId: number
    content: string
  }>()

  const conversationId = conversation?.id
  const { data: chatHistory, refetch } = useQuery({
    queryKey: ['chat-history', chatHistoryQueryConfig],
    queryFn: () => getChatHistory(chatHistoryQueryConfig),
    enabled: !!conversationId
  })

  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, newContent }: { messageId: number; newContent: string }) =>
      updateMessage(messageId, newContent)
  })

  const onPrivateMessage = () => {
    refetch()
  }

  const onConnected = () => {
    setIsConnected(true)
    if (!isGroup) {
      stompClient.current?.subscribe('/user/' + sender?.id + '/private', onPrivateMessage)
    } else {
      stompClient.current?.subscribe('/user/' + sender?.id + '/group', onPrivateMessage)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log(err)
  }

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws')
    stompClient.current = over(Sock)

    const accessToken = localStorage.getItem('accessToken')
    const headers = {
      Authorization: 'Bearer ' + accessToken
    }
    stompClient.current.connect(headers, onConnected, onError)
  }

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        setIsConnected(false)
        console.log('Disconnected')
      })
    }
  }

  const sendPrivateValue = (message?: string, imageUrl?: string) => {
    if (stompClient.current && isConnected && conversation) {
      const chatMessage = {
        sender,
        receiver: receivers,
        message,
        imageUrl: imageUrl ?? '',
        conversationId: conversation.id
      }
      refetch()
      if (!isGroup) {
        stompClient.current.send('/app/private-message', {}, JSON.stringify(chatMessage))
      } else {
        stompClient.current.send('/app/group-message', {}, JSON.stringify(chatMessage))
      }
    }
  }

  const handleUpdateMessage = (messageId: number, newContent: string) => {
    updateMessageMutation.mutate(
      { messageId, newContent },
      {
        onSuccess: () => {
          refetch()
          setMessageEdit(undefined)
        }
      }
    )
  }

  const handleCloseUpdateMessage = () => {
    setMessageEdit(undefined)
  }

  // connect when exist sender and not connect to Socket
  useEffect(() => {
    if (sender?.id && !isConnected) {
      console.log('connected')
      connect()
    }
  }, [sender?.id, isConnected])

  useEffect(() => {
    if (conversation) {
      if (isConnected) {
        disconnect()
      }
      connect()
    }

    return () => {
      disconnect()
    }
  }, [conversation])

  return (
    <div className='h-remain-screen flex flex-col'>
      <ChatHeader conversation={conversation} sender={sender} receivers={receivers} />
      <div className='flex-1 h-full flex-grow overflow-y-auto px-4'>
        <ChatHistory
          conversation={conversation}
          sender={sender}
          receivers={receivers}
          chatData={chatHistory?.data.data.content}
          setMessageEdit={setMessageEdit}
        />
      </div>
      <ChatInput
        messageEdit={messageEdit}
        sendMessage={sendPrivateValue}
        handleCloseUpdateMessage={handleCloseUpdateMessage}
        handleUpdateMessage={handleUpdateMessage}
      />
    </div>
  )
}
