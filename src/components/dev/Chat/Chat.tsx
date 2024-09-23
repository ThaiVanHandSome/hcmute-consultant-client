import { Input } from '@/components/ui/input'
import { Conversation } from '@/types/conversation.type'
import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Client, over } from 'stompjs'
import SockJS from 'sockjs-client'
import { useQuery } from '@tanstack/react-query'
import { getChatHistory } from '@/apis/chat.api'
import { Chat as ChatType } from '@/types/chat.type'

const friendAvatar =
  'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/311590829_1254153242092852_4832227332157715848_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGNnmpAkRiZt0npaCZ4oArImf3JOiEdXRuZ_ck6IR1dGwgrTcgAYPXDlKYJIj1Ihc1NJ4SfxczRdoQ60WCQDr4g&_nc_ohc=3F_zqbfttEoQ7kNvgEtIi4g&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AVkOFBUh1UonSwKYwmEKFnY&oh=00_AYCjlHOhy6FXEACkoDhHUFGkG0-e_3wchilTmo_lJV4HVQ&oe=66F45ED2'

interface Props {
  readonly conversation: Conversation | undefined
}

interface UserData {
  userId: number
  receiverId: number
  connected: boolean
  conversationId: number
}

// eslint-disable-next-line no-var
var stompClient: Client = null
export default function Chat({ conversation }: Props) {
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
    if (privateChats.get(chatId)) {
      privateChats.get(chatId).push(payloadData)
      setPrivateChats(new Map(privateChats))
    } else {
      let list = []
      list.push(payloadData)
      privateChats.set(chatId, list)
      setPrivateChats(new Map(privateChats))
    }
  }

  const onConnected = () => {
    setUserData((prevData) => ({ ...prevData, connected: true }) as UserData)
    stompClient.subscribe('/user/' + userData?.userId + '/private', onPrivateMessage)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log(err)
  }

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws')
    stompClient = over(Sock)
    stompClient.connect({}, onConnected, onError)
  }

  const sendPrivateValue = () => {
    if (stompClient && conversation) {
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

      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage))

      setChatContent('')
    }
  }

  const conversationId = conversation?.id
  const { data: chatHistory } = useQuery({
    queryKey: ['chat-history', conversationId],
    queryFn: () => getChatHistory(conversationId as number),
    enabled: !!conversationId
  })

  // handle scroll to end conversation
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (userData?.userId && userData.receiverId) connect()
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log('Disconnected successfully')
        })
      }
    }
  }, [userData?.userId, userData?.receiverId])

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
            if ((index + 1 < data.size && data[index + 1].senderName === userData?.userId) || index === data.length - 1)
              avatarCanShow = true
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
