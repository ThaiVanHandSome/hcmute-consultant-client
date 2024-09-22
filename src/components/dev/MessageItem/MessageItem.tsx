import path from '@/constants/path'
import { Conversation } from '@/types/conversation.type'
import clsx from 'clsx'
import { createSearchParams, useNavigate } from 'react-router-dom'

interface Props {
  readonly conversationIdActive?: number
  readonly conversation: Conversation
}

export default function MessageItem({ conversation, conversationIdActive }: Props) {
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
      <img
        src='https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=-zpoaE3hKksQ7kNvgHKM4JO&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYDWrgK1AuTcKAaPFhlUcPMX1s7Q9vZPSnQG2LM3s2Rcvg&oe=66F45127'
        alt='avatar'
        className='size-14 rounded-full'
      />
      <div className='w-[80%] ml-2 flex items-center'>
        <p className='font-bold truncate text-sm'>
          {conversation.consultant.consultantName} - {conversation.department.name}
        </p>
      </div>
    </div>
  )
}
