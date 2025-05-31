import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Sparkles, Bot, User, Trash } from 'lucide-react'
import TypingMessage from '@/pages/User/ChatBot/TypingMessage'
import { toast } from 'sonner'

interface Message {
  text: string
  sender: 'user' | 'bot'
  timestamp: string
  id: string
}

interface MessageResponse {
  data: {
    answer: string
    question: string
    source: string
    time: number
  }
  message: string
  status: string
}

const STORAGE_KEY = 'chatbot_messages'

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [autoScroll, setAutoScroll] = useState<boolean>(true)
  const [viewedMessages, setViewedMessages] = useState<Set<string>>(new Set())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const generateMessageId = (text: string, sender: 'user' | 'bot'): string => {
    return `${sender}-${text.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`
  }

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY)
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages) as Message[]
        const validMessages = parsedMessages.map((msg) => {
          if (!msg.id) {
            return {
              ...msg,
              id: generateMessageId(msg.text, msg.sender)
            }
          }
          return msg
        })
        setMessages(validMessages)
        const savedMessageIds = new Set(validMessages.map((msg) => msg.id))
        setViewedMessages(savedMessageIds)
      } catch (error) {
        console.error('Lỗi khi đọc tin nhắn từ localStorage:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const formatTableMessage = (text: string) => {
    if (text.includes('|') && text.includes('---')) {
      const lines = text.split('\n')
      const tableStartIndex = lines.findIndex((line) => line.includes('|'))
      let tableEndIndex = lines.length - 1
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('|')) {
          tableEndIndex = i
          break
        }
      }
      const beforeTableText = lines.slice(0, tableStartIndex).join('\n')
      const afterTableText = lines.slice(tableEndIndex + 1).join('\n')
      const tableLines = lines.slice(tableStartIndex, tableEndIndex + 1)
      const tableRows = tableLines.filter((row) => row.trim() !== '')
      const headers = tableRows[0].split('|').filter((cell) => cell.trim()).length
      const processedRows = tableRows.map((row, rowIndex) => {
        if (row.includes('---') || rowIndex === 0) {
          return {
            cells: row
              .split('|')
              .map((cell) => cell.trim())
              .filter((cell) => cell),
            isHeader: true,
            level: 0
          }
        }
        const cells = row
          .split('|')
          .map((cell) => cell.trim())
          .filter((cell) => cell)
        const isScoreLine = /^(\d+(\.\d+)?)$/.test(cells[0]) || /^(\d+)[-–](\d+(\.\d+)?)$/.test(cells[0])
        const isRatingLine = !isScoreLine && cells.length < headers
        let level = 0
        if (isScoreLine || isRatingLine) {
          level = 1
        }
        return { cells, isHeader: false, level }
      })

      return (
        <div className='w-full'>
          {beforeTableText && <div className='text-sm whitespace-pre-wrap mb-3'>{beforeTableText}</div>}
          <div className='overflow-x-auto mb-3'>
            <table className='w-full border-collapse rounded-md'>
              <thead>
                {processedRows
                  .filter((row) => row.isHeader)
                  .map((row, rowIndex) => (
                    <tr key={`header-${rowIndex}`} className='bg-primary/10'>
                      {row.cells.map((cell, cellIndex) => (
                        <th key={cellIndex} className='px-3 py-2 text-left font-semibold'>
                          {cell}
                        </th>
                      ))}
                    </tr>
                  ))}
              </thead>
              <tbody>
                {processedRows
                  .filter((row) => !row.isHeader && !row.cells.some((cell) => cell.includes('---')))
                  .map((row, rowIndex) => {
                    let displayCells = [...row.cells]
                    if (row.level > 0) {
                      displayCells = ['', ...displayCells]
                    }
                    return (
                      <tr key={rowIndex} className='border-t border-gray-200'>
                        {displayCells.map((cell, cellIndex) => (
                          <td key={cellIndex} className={`px-3 py-2 text-left`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          {afterTableText && <div className='text-sm whitespace-pre-wrap'>{afterTableText}</div>}
        </div>
      )
    }
    return <div className='text-sm whitespace-pre-wrap'>{text}</div>
  }

  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, autoScroll])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    if (distanceToBottom > 100) {
      if (autoScroll) setAutoScroll(false)
    } else if (distanceToBottom < 20) {
      if (!autoScroll) setAutoScroll(true)
    }
  }

  const fetchWithTimeout = async (url: string, timeout: number) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal
      })
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      if ((error as unknown as { name: string }).name === 'AbortError') {
        throw new Error('TIMEOUT')
      }
      throw error
    }
  }

  const handleGetResponse = async (message: string) => {
    setIsTyping(true)
    try {
      const res = await fetchWithTimeout(
        `${import.meta.env.VITE_AI_URL}/chat?text=${message}`,
        30000 // timeout 30 seconds
      )
      if (res.ok) {
        const result = (await res.json()) as MessageResponse
        const messageId = generateMessageId(result.data.answer, 'bot')
        setMessages((prev) => [
          ...prev,
          {
            text: result.data.answer,
            sender: 'bot' as const,
            timestamp: new Date().toLocaleTimeString(),
            id: messageId
          }
        ])
        setViewedMessages((prev) => new Set(prev).add(messageId))
      } else {
        const errorMessageId = generateMessageId('error', 'bot')
        setMessages((prev) => [
          ...prev,
          {
            text: 'Xin lỗi, hiện tại tôi đang gặp một chút trục trặc kỹ thuật. Bạn vui lòng thử lại sau nhé!',
            sender: 'bot' as const,
            timestamp: new Date().toLocaleTimeString(),
            id: errorMessageId
          }
        ])
        setViewedMessages((prev) => new Set(prev).add(errorMessageId))
      }
    } catch (error) {
      const errorMessageId = generateMessageId('error', 'bot')
      const errorMessage =
        (error as unknown as { message: string }).message === 'TIMEOUT'
          ? 'Rất tiếc, thời gian phản hồi quá lâu. Vui lòng thử lại sau!'
          : 'Rất tiếc, tôi không thể kết nối được với server. Vui lòng kiểm tra kết nối mạng và thử lại sau.'

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          sender: 'bot' as const,
          timestamp: new Date().toLocaleTimeString(),
          id: errorMessageId
        }
      ])
      setViewedMessages((prev) => new Set(prev).add(errorMessageId))
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputMessage.trim() === '') return
    setAutoScroll(true)
    const messageId = generateMessageId(inputMessage, 'user')
    setMessages((prev) => [
      ...prev,
      {
        text: inputMessage,
        sender: 'user' as const,
        timestamp: new Date().toLocaleTimeString(),
        id: messageId
      }
    ])
    setViewedMessages((prev) => new Set(prev).add(messageId))
    const currentMessage = inputMessage
    setInputMessage('')
    await handleGetResponse(currentMessage)
  }

  const isMessageViewed = (message: Message): boolean => {
    return viewedMessages.has(message.id)
  }

  const formatMessage = (text: string) => {
    if (!text) return ''

    text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
    const lines = text.split('\n')
    let result = ''
    let inBulletGroup = false
    let bulletGroup = ''
    let indentLevel = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isLastLine = i === lines.length - 1
      const nextLine = i < lines.length - 1 ? lines[i + 1] : ''

      if (line.trim().startsWith('Chào') && line.includes('bạn')) {
        result += `<div class="font-semibold text-primary-600 mb-2">${line}</div>`
        continue
      }

      if (
        (line.includes('hài lòng') && (line.includes('Câu trả lời') || line.includes('còn câu hỏi'))) ||
        (line.includes('Cảm ơn câu hỏi') && line.includes('vui lòng hỏi')) ||
        line.toLowerCase().includes('nếu còn câu hỏi')
      ) {
        if (inBulletGroup) {
          result += `<div class="bullet-group mb-2">${bulletGroup}</div>`
          inBulletGroup = false
        }
        result += `<div class="font-semibold text-primary-600 mt-3">${line}</div>`
        continue
      }

      if (line.trim().startsWith('*')) {
        if (!inBulletGroup) {
          inBulletGroup = true
          bulletGroup = ''
        }
        const bulletContent = line.trim().substring(1).trim()
        const leadingSpacesMatch = line.match(/^\s*/)
        const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0

        if (leadingSpaces >= 4) {
          bulletGroup += `<div class="flex items-start mb-1.5 pl-10">
                          <span class="inline-block w-2 h-2 rounded-full border border-primary/50 mr-2 mt-1.5 flex-shrink-0"></span>
                          <span class="flex-1">${bulletContent}</span>
                        </div>`
          indentLevel = 1
        } else {
          bulletGroup += `<div class="flex items-start mb-1.5 pl-6">
                          <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary/20 mr-2 mt-1.5 flex-shrink-0"></span>
                          <span class="flex-1">${bulletContent}</span>
                        </div>`
          indentLevel = 0
        }
      } else if (line.trim()) {
        if (inBulletGroup) {
          const leadingSpacesMatch = line.match(/^\s*/)
          const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0

          if (leadingSpaces >= 4 || indentLevel > 0) {
            bulletGroup += `<div class="pl-10 mb-1.5 text-muted-foreground">${line.trim()}</div>`
          } else {
            bulletGroup += `<div class="pl-6 mb-1.5 text-muted-foreground">${line.trim()}</div>`
          }
        } else {
          result += `<div class="mb-2">${line}</div>`
        }
      } else if (!isLastLine) {
        if (inBulletGroup && bulletGroup.trim() !== '') {
          const nextIsBullet = nextLine.trim().startsWith('*')

          if (!nextIsBullet && nextLine.trim() !== '') {
            result += `<div class="bullet-group mb-2">${bulletGroup}</div>`
            inBulletGroup = false
            bulletGroup = ''
            indentLevel = 0
          } else {
            bulletGroup += '<div class="h-1"></div>'
          }
        } else {
          result += '<div class="h-2"></div>'
        }
      }
    }

    if (inBulletGroup && bulletGroup.trim() !== '') {
      result += `<div class="bullet-group mb-2">${bulletGroup}</div>`
    }

    return result
  }

  return (
    <div className='container mx-auto max-w-4xl h-remain-screen bg-white flex flex-col'>
      <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className={`iconWrapper bg-primary-foreground/10 p-2 rounded-full backdrop-blur-sm`}>
              <MessageSquare className='w-6 h-6 text-primary-foreground' />
              <Sparkles className={`sparkle w-4 h-4 text-yellow-400`} />
            </div>
            <div>
              <h1 className='text-xl font-semibold flex items-center gap-2'>
                AI Assistant
                <button
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY)
                    setMessages([])
                    setViewedMessages(new Set())
                    toast.success('Đã xóa lịch sử chat')
                  }}
                  className='ml-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600'
                  title='Xóa lịch sử chat'
                >
                  <Trash className='w-3.5 h-3.5' />
                </button>
              </h1>
              <p className='text-sm opacity-80'>Powered by Advanced AI</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            <span className='text-sm'>Online</span>
          </div>
        </div>
      </div>
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-4 space-y-4 messagesContainer`}
      >
        {messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full gap-4'>
            <div className={`welcomeIcon bg-primary/10 p-4 rounded-full`}>
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
              <div
                className={`styles.avatar bg-primary/10 p-2 rounded-full flex-shrink-0 self-start h-9 w-9 flex items-center justify-center`}
              >
                <Bot className='w-5 h-5 text-primary' />
              </div>
            )}
            <div
              className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground max-w-[70%]'
                  : 'bg-muted text-muted-foreground shadow-sm max-w-[90%]'
              } messageEnter`}
            >
              {message.sender === 'user' ? (
                <p className='text-sm'>{message.text}</p>
              ) : message.text.includes('|') && message.text.includes('---') ? (
                formatTableMessage(message.text)
              ) : isMessageViewed(message) ? (
                <div
                  className='text-sm whitespace-pre-wrap'
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                ></div>
              ) : (
                <TypingMessage text={message.text} speed={30} formatMessage={formatMessage} />
              )}
              <span className='text-xs opacity-70 mt-1 block'>{message.timestamp}</span>
            </div>
            {message.sender === 'user' && (
              <div
                className={`avatar bg-primary/10 p-2 rounded-full flex-shrink-0 self-start h-9 w-9 flex items-center justify-center`}
              >
                <User className='w-5 h-5 text-primary' />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className='flex items-center gap-2'>
            <div
              className={`avatar bg-primary/10 p-2 rounded-full flex-shrink-0 self-start h-9 w-9 flex items-center justify-center`}
            >
              <Bot className='w-5 h-5 text-primary' />
            </div>
            <div className='bg-muted text-muted-foreground rounded-full p-2 w-10 h-10 flex items-center justify-center flex-shrink-0'>
              <div className='flex gap-1 justify-center items-center'>
                <div className={`typingDot`}></div>
                <div className={`typingDot animation-delay-200`}></div>
                <div className={`typingDot animation-delay-400`}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
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
