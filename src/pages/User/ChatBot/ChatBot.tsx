import { useState } from 'react'
import { MessageSquare, Send, Sparkles, Bot, User } from 'lucide-react'
import styles from './Chatbot.module.scss'
import SplashCursor from './SplashCursor'

interface Message {
  text: string
  sender: 'user' | 'bot'
  timestamp: string
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

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

    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Xin chào! Tôi là chatbot. Tôi có thể giúp gì cho bạn?',
          sender: 'bot' as const,
          timestamp: new Date().toLocaleTimeString()
        }
      ])
      setIsTyping(false)
    }, 2000)

    setInputMessage('')
  }

  return (
    <div className='container mx-auto max-w-4xl h-remain-screen bg-white flex flex-col'>
      <SplashCursor />

      {/* Header */}
      <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className={`${styles.iconWrapper} bg-primary-foreground/10 p-2 rounded-full backdrop-blur-sm`}>
              <MessageSquare className='w-6 h-6 text-primary-foreground' />
              <Sparkles className={`${styles.sparkle} w-4 h-4 text-yellow-400`} />
            </div>
            <div>
              <h1 className='text-xl font-semibold'>AI Assistant</h1>
              <p className='text-sm opacity-80'>Powered by Advanced AI</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            <span className='text-sm'>Online</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${styles.messagesContainer}`}>
        {messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className={`${styles.welcomeIcon} bg-primary/10 p-4 rounded-full`}>
              <MessageSquare className='w-12 h-12 text-primary' />
            </div>
            <h2 className='text-xl font-semibold'>Chào mừng đến với AI Assistant</h2>
            <p className='text-muted-foreground text-center max-w-md'>
              Tôi có thể giúp bạn trả lời các câu hỏi, tạo nội dung và nhiều hơn nữa. Hãy bắt đầu cuộc trò chuyện!
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {message.sender === 'bot' && (
              <div className={`${styles.avatar} bg-primary/10 p-2 rounded-full`}>
                <Bot className='w-5 h-5 text-primary' />
              </div>
            )}
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
            {message.sender === 'user' && (
              <div className={`${styles.avatar} bg-primary/10 p-2 rounded-full`}>
                <User className='w-5 h-5 text-primary' />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className='flex items-center gap-2'>
            <div className={`${styles.avatar} bg-primary/10 p-2 rounded-full`}>
              <Bot className='w-5 h-5 text-primary' />
            </div>
            <div className='bg-muted text-muted-foreground rounded-lg p-3'>
              <div className='flex gap-1'>
                <div className={`${styles.typingDot}`}></div>
                <div className={`${styles.typingDot} animation-delay-200`}></div>
                <div className={`${styles.typingDot} animation-delay-400`}></div>
              </div>
            </div>
          </div>
        )}
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
