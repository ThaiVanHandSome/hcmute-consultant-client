import path from '@/constants/path'
import { Conversation } from '@/types/conversation.type'
import clsx from 'clsx'
import { useMemo } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly conversationIdActive?: number
  readonly conversation: Conversation
}

export default function MessageItem({ conversation, conversationIdActive }: Props) {
  const receiver = useMemo(() => {
    return conversation?.members.find((member) => member.sender === false)
  }, [conversation])

  const navigate = useNavigate()

  // switch to other conversation
  const handleNavigateToOtherMessage = () => {
    if (conversationIdActive === conversation.id) return
    navigate({
      pathname: path.messages,
      search: createSearchParams({
        id: String(conversation.id)
      }).toString()
    })
  }
  return (
    <div
      aria-hidden='true'
      className={clsx('flex w-full my-2 p-2 rounded-lg hover:bg-slate-100 transition-all cursor-pointer', {
        'bg-slate-100': conversation.id === conversationIdActive
      })}
      onClick={handleNavigateToOtherMessage}
    >
      <img src={receiver?.avatarUrl} alt='avatar' className='size-14 rounded-full' />
      <div className='w-[80%] ml-2 flex items-center'>
        <p className='font-bold truncate text-sm'>{receiver?.name}</p>
      </div>
    </div>
  )
}
