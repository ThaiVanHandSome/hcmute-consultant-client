import { Input } from '@/components/ui/input'
import { Conversation } from '@/types/conversation.type'
import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Client, over } from 'stompjs'
import SockJS from 'sockjs-client'
import { useQuery } from '@tanstack/react-query'
import { getChatHistory } from '@/apis/chat.api'
import { Chat as ChatType } from '@/types/chat.type'
import { ChatHistoryConfig } from '@/types/params.type'

interface Props {
  readonly conversation: Conversation | undefined
}

interface UserData {
  userId: number | null
  receiverId: number | null
  connected: boolean
  conversationId: number | null
}

export default function Chat({ conversation }: Props) {
  const chatHistoryQueryConfig: ChatHistoryConfig = {
    conversationId: conversation?.id as number,
    page: 0,
    size: 100,
    sortBy: '',
    sortDir: 'desc'
  }
  const stompClient = useRef<Client | null>(null)
  const sender = useMemo(() => {
    return conversation?.members.find((member) => member.sender === true)
  }, [conversation])

  const receiver = useMemo(() => {
    return conversation?.members.find((member) => member.sender === false)
  }, [conversation])

  const [privateChats, setPrivateChats] = useState(new Map())
  const [userData, setUserData] = useState<UserData>()
  const [chatContent, setChatContent] = useState<string>('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPrivateMessage = (payload: any) => {
    const payloadData = JSON.parse(payload.body)
    const chatId = payloadData.conversationId
    setPrivateChats((prevChats) => {
      const updatedChats = new Map(prevChats)
      const currentMessages = updatedChats.get(chatId) || []
      currentMessages.push(payloadData)
      updatedChats.set(chatId, currentMessages)
      return updatedChats
    })
  }

  const onConnected = () => {
    setUserData((prevData) => ({ ...prevData, connected: true }) as UserData)
    stompClient.current?.subscribe('/user/' + userData?.userId + '/private', onPrivateMessage)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log(err)
  }

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws')
    stompClient.current = over(Sock)
    stompClient.current.connect({}, onConnected, onError)
  }

  const sendPrivateValue = () => {
    if (stompClient.current && userData?.connected && conversation) {
      const chatMessage = {
        sender: {
          id: userData?.userId
        },
        receiver: {
          id: userData?.receiverId
        },
        message: chatContent,
        conversationId: userData?.conversationId
      }
      const currentMessages = privateChats.get(userData?.conversationId) || []
      const newMessages = [...currentMessages, chatMessage]
      const updatedChats = new Map(privateChats)
      updatedChats.set(userData?.conversationId, newMessages)
      setPrivateChats(updatedChats)
      setChatContent('')
      stompClient.current.send('/app/private-message', {}, JSON.stringify(chatMessage))
    }
  }

  const conversationId = conversation?.id
  const { data: chatHistory } = useQuery({
    queryKey: ['chat-history', chatHistoryQueryConfig],
    queryFn: () => getChatHistory(chatHistoryQueryConfig),
    enabled: !!conversationId
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [conversation, privateChats])

  useEffect(() => {
    if (userData?.userId && userData?.receiverId && !userData?.connected) {
      connect()
    }
  }, [userData?.userId, userData?.receiverId, userData?.connected])

  const chatHistoryJson = JSON.stringify(chatHistory)
  useEffect(() => {
    if (!chatHistory) return
    const messages = chatHistory?.data.data.content?.map((msg: ChatType) => ({
      message: msg.message,
      sender: {
        id: msg.sender.id
      },
      receiver: {
        id: msg.receiver.id
      },
      date: msg.date
    }))

    const updatedChats = new Map(privateChats)
    updatedChats.set(conversationId, messages)
    setPrivateChats(updatedChats)
  }, [chatHistoryJson])

  useEffect(() => {
    if (!conversation) return
    setUserData({
      userId: sender?.id as number,
      receiverId: receiver?.id as number,
      connected: false,
      conversationId: conversation.id
    })
    return () => {
      if (stompClient.current) {
        console.log('Disconnecting...')
        stompClient.current.disconnect(() => {
          console.log('Disconnected successfully')
        })
        setUserData({
          userId: null,
          receiverId: null,
          conversationId: null,
          connected: false
        })
        setPrivateChats(new Map())
      }
    }
  }, [conversation])

  console.log(privateChats)

  return (
    <div className='h-remain-screen flex flex-col'>
      <div>
        <div className='flex items-center py-2 shadow-lg px-3'>
          <img src={receiver?.avatarUrl} alt='avatar' className='size-10 rounded-full' />
          <div className='ml-2'>
            <p className='font-bold text-lg'>{receiver?.name}</p>
          </div>
        </div>
      </div>
      <div className='flex-1 h-full flex-grow overflow-y-auto px-4'>
        {privateChats.get(userData?.conversationId)?.map((chat: ChatType, index: number) => {
          const data = privateChats.get(userData?.conversationId)
          if (chat.sender.id !== userData?.userId) {
            let avatarCanShow = false
            if (
              (index + 1 < data.length && data[index + 1].sender.id === userData?.userId) ||
              index === data.length - 1
            ) {
              avatarCanShow = true
            }

            return (
              <div key={index} className='flex justify-start my-3'>
                <div className='flex items-center'>
                  {avatarCanShow && <img src={receiver?.avatarUrl} alt='avatar' className='size-8 rounded-full' />}
                  {!avatarCanShow && <div className='size-8'></div>}
                  <div className='ml-2 p-2 bg-slate-200 rounded-3xl'>{chat.message}</div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={index} className='flex justify-end my-3 '>
                <div className='p-2 rounded-3xl bg-primary text-white max-w-[50%] break-words'>{chat.message}</div>
              </div>
            )
          }
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <div className='shadow-lg px-3 py-2 flex items-center w-full'>
        <div>
          <ImageIcon className='size-7 mr-2 text-primary cursor-pointer' />
        </div>
        <div className='flex-1'>
          <Input value={chatContent} onChange={(e) => setChatContent(e.target.value)} className='!rounded-lg' />
        </div>
        <PaperPlaneIcon className='size-7 ml-2 text-primary cursor-pointer' onClick={sendPrivateValue} />
      </div>
    </div>
  )
}
