import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import styles from './Chatbot.module.scss'

interface Message {
  text: string
  sender: 'user' | 'bot'
  timestamp: string
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputMessage.trim() === '') return

    setMessages((prev) => [
      ...prev,
      {
        text: inputMessage,
        sender: 'user' as const,
        timestamp: new Date().toLocaleTimeString()
      }
    ])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Xin chào! Tôi là chatbot. Tôi có thể giúp gì cho bạn?',
          sender: 'bot' as const,
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    }, 1000)

    setInputMessage('')
  }

  return (
    <div className='container mx-auto max-w-4xl h-remain-screen flex flex-col'>
      {/* Header */}
      <div className='bg-primary text-primary-foreground p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className={`${styles.iconWrapper} bg-primary-foreground/10 p-2 rounded-full`}>
              <MessageSquare className='w-6 h-6 text-primary-foreground animate-bounce' />
            </div>
            <div>
              <h1 className='text-xl font-semibold'>Chatbot Assistant</h1>
              <p className='text-sm opacity-80'>Hỏi tôi bất cứ điều gì</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            <span className='text-sm'>Đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${styles.messagesContainer}`}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground shadow-sm'
              } ${styles.messageEnter}`}
            >
              <p className='text-sm'>{message.text}</p>
              <span className='text-xs opacity-70 mt-1 block'>{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className='border-t border-border bg-card p-4'>
        <form onSubmit={handleSendMessage} className='flex gap-2'>
          <input
            type='text'
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
            placeholder='Nhập tin nhắn của bạn...'
            className='flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          />
          <button
            type='submit'
            className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
          >
            <Send className='w-4 h-4 mr-2' />
            Gửi
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBot
