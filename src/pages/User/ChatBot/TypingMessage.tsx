import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TypingMessageProps {
  text: string
  speed?: number
}

const TypingMessage = ({ text, speed = 5 }: TypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever displayed text changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (messageRef.current) {
        const container = messageRef.current.closest('.messagesContainer')
        container?.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    }

    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 10)
    return () => clearTimeout(timeoutId)
  }, [displayedText])

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
        {isComplete ? text : displayedText}
      </ReactMarkdown>
    </div>
  )
}

export default TypingMessage
