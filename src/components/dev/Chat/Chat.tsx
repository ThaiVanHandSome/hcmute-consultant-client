import { Conversation } from '@/types/conversation.type'
import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Client, over } from 'stompjs'
import SockJS from 'sockjs-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getChatHistory } from '@/apis/chat.api'
import { Chat as ChatType } from '@/types/chat.type'
import { ChatHistoryConfig } from '@/types/params.type'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import InputCustom from '@/components/dev/Form/InputCustom'
import { uploadFile } from '@/apis/file.api'
import { Spinner } from '@/icons'
import { Input } from '@/components/ui/input'

interface Props {
  readonly conversation: Conversation | undefined
}

interface UserData {
  user: { id: number } | undefined
  receivers: { id: number }[] | undefined
  connected: boolean
  conversationId: number | null
}

export default function Chat({ conversation }: Props) {
  const form = useForm({
    defaultValues: {
      message: ''
    }
  })
  const chatContent = form.watch('message')
  const chatHistoryQueryConfig: ChatHistoryConfig = {
    conversationId: conversation?.id as number,
    page: 0,
    size: 1000,
    sortBy: '',
    sortDir: 'asc'
  }
  const stompClient = useRef<Client | null>(null)
  const sender = useMemo(() => {
    return conversation?.members.find((member) => member.sender === true)
  }, [conversation])

  const receivers = useMemo(() => {
    return conversation?.members.filter((member) => member.sender === false)
  }, [conversation])

  const [userData, setUserData] = useState<UserData>()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const conversationId = conversation?.id
  const { data: chatHistory, refetch } = useQuery({
    queryKey: ['chat-history', chatHistoryQueryConfig],
    queryFn: () => getChatHistory(chatHistoryQueryConfig),
    enabled: !!conversationId
  })

  const fileUploadMutation = useMutation({
    mutationFn: (body: FormData) => uploadFile(body)
  })

  const onPrivateMessage = () => {
    refetch()
  }

  const onConnected = () => {
    setUserData((prevData) => ({ ...prevData, connected: true }) as UserData)
    stompClient.current?.subscribe('/user/' + userData?.user?.id + '/private', onPrivateMessage)
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

  const sendPrivateValue = (imageUrl?: string) => {
    if (stompClient.current && userData?.connected && conversation) {
      const chatMessage = {
        sender: userData?.user,
        receiver: userData?.receivers,
        message: chatContent,
        imageUrl: imageUrl ?? '',
        conversationId: userData?.conversationId
      }
      refetch()
      form.setValue('message', '')

      stompClient.current.send('/app/private-message', {}, JSON.stringify(chatMessage))
    }
  }

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      fileUploadMutation.mutate(formData, {
        onSuccess: (res) => {
          sendPrivateValue(res.data.fileUrl)
        },
        onError: (err) => {
          console.log(err)
        }
      })
    }
  }

  const onSubmit = form.handleSubmit((values) => {
    if (!values.message) return
    sendPrivateValue()
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }
  const json = JSON.stringify(chatHistory)
  useEffect(() => {
    scrollToBottom()
  }, [conversation, json])

  useEffect(() => {
    if (userData?.user?.id || !userData?.connected) {
      connect()
    }
  }, [userData?.user?.id, userData?.connected])

  useEffect(() => {
    if (!conversation) return
    setUserData({
      user: sender,
      receivers: receivers,
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
          user: undefined,
          receivers: undefined,
          conversationId: null,
          connected: false
        })
      }
    }
  }, [conversation])

  return (
    <div className='h-remain-screen flex flex-col'>
      <div>
        <div className='flex items-center py-2 shadow-lg px-3'>
          <img
            src={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0].avatarUrl}
            alt='avatar'
            className='size-10 rounded-full'
          />
          <div className='ml-2'>
            <p className='font-bold text-lg'>{conversation?.isGroup ? conversation.name : receivers?.[0].name}</p>
          </div>
        </div>
      </div>
      <div className='flex-1 h-full flex-grow overflow-y-auto px-4'>
        <div className='flex flex-col items-center mt-3'>
          <img
            src={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0].avatarUrl}
            alt='reciever-avatar'
            className='size-44 mb-2'
          />
          <p className='font-bold text-xl'>{conversation?.isGroup ? conversation.name : receivers?.[0].name}</p>
        </div>
        {chatHistory?.data.data.content?.map((chat: ChatType, index: number) => {
          const data = chatHistory?.data.data.content
          if (!chat.imageUrl && !chat.message) return
          if (chat.sender.id !== userData?.user?.id) {
            let avatarCanShow = false
            if (
              (index + 1 < data.length && data[index + 1].sender.id === userData?.user?.id) ||
              index === data.length - 1
            ) {
              avatarCanShow = true
            }

            return (
              <div key={chat.id} className='flex justify-start my-3'>
                <div className='flex items-end w-full'>
                  {avatarCanShow && <img src={chat.sender?.avatarUrl} alt='avatar' className='size-8 rounded-full' />}
                  {!avatarCanShow && <div className='size-8'></div>}
                  {chat.message && (
                    <div className='ml-2 p-2 bg-slate-200 rounded-3xl max-w-[50%] break-words'>{chat.message}</div>
                  )}
                  {chat.imageUrl && <img src={chat.imageUrl} alt='user-img' className='ml-2 w-1/3 object-cover' />}
                </div>
              </div>
            )
          } else {
            return (
              <div key={chat.id} className='flex justify-end my-3'>
                {chat.message && (
                  <div className='p-2 rounded-3xl bg-primary text-white max-w-[50%] break-words'>{chat.message}</div>
                )}
                {chat.imageUrl && <img src={chat.imageUrl} alt='user-img' className='ml-2 w-1/3 object-cover' />}
              </div>
            )
          }
        })}
        <div className='flex justify-end my-3 '>{fileUploadMutation.isPending && <Spinner />}</div>
        <div ref={messagesEndRef}></div>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className='shadow-lg px-3 py-2 flex items-center w-full'>
            <Input ref={inputFileRef} type='file' className='hidden' onChange={handleUploadFile} />
            <div>
              <ImageIcon
                className='size-7 mr-2 text-primary cursor-pointer'
                onClick={() => inputFileRef.current?.click()}
              />
            </div>
            <div className='flex-1'>
              <InputCustom
                control={form.control}
                name='message'
                className='mb-0'
                classNameInput='rounded-lg bg-slate-200'
                autoComplete='nope'
              />
            </div>
            <button type='submit'>
              <PaperPlaneIcon className='size-7 ml-2 text-primary cursor-pointer' />
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
