import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TypingMessageProps {
  text: string
  speed?: number
  formatMessage?: (text: string) => string
}

const TypingMessage = ({ text, speed = 5, formatMessage }: TypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    setDisplayedText('')
    setIsComplete(false)

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  // Nếu text đã hiển thị hoàn tất và có formatMessage, sử dụng formatMessage
  if (isComplete && formatMessage) {
    return (
      <div 
        ref={messageRef} 
        className="w-full overflow-hidden text-sm"
        dangerouslySetInnerHTML={{ __html: formatMessage(text) }}
      ></div>
    )
  }

  return (
    <div ref={messageRef} className="w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          div: ({ children }) => (
            <div className='text-sm prose prose-sm max-w-none prose-p:leading-normal'>{children}</div>
          ),
          pre: ({ children }) => <pre className='p-2 bg-background/80 rounded'>{children}</pre>,
          code: ({ children }) => <code className='bg-background/80 rounded px-1'>{children}</code>,
          table: ({ children }) => (
            <table className='border-collapse bg-white table-auto w-full text-sm'>{children}</table>
          ),
          th: ({ children }) => (
            <th className='border border-slate-300 font-semibold p-2 text-slate-900 text-left bg-slate-100'>
              {children}
            </th>
          ),
          td: ({ children }) => <td className='border border-slate-300 p-2 text-slate-500'>{children}</td>
        }}
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  )
}

export default TypingMessage
