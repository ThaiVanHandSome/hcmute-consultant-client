import { Bot, Check, UserCircle } from 'lucide-react'

interface Props {
  message: {
    text: string
    sender: 'user' | 'bot'
    timestamp: string
    id: string
  }
  isViewed: boolean
}

export default function Message({ message, isViewed }: Props) {
  return (
    <div
      className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
      data-message-id={message.id}
    >
      <div className='w-8 h-8 rounded-full shrink-0 bg-primary/10 grid place-items-center'>
        {message.sender === 'user' ? (
          <UserCircle className='w-5 h-5 text-primary' />
        ) : (
          <Bot className='w-5 h-5 text-primary' />
        )}
      </div>
      <div
        className={`max-w-[75%] space-y-1 ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`rounded-lg px-3 py-2 ${
            message.sender === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <span>{message.timestamp}</span>
          {message.sender === 'bot' && isViewed && <Check className='w-3 h-3' />}
        </div>
      </div>
    </div>
  )
} 