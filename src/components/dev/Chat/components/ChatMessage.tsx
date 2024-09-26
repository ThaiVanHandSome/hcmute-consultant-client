import clsx from 'clsx'

import { Chat } from '@/types/chat.type'

interface Props {
  readonly isSender: boolean
  readonly chat: Chat
  readonly avatarCanShow?: boolean
}

export default function ChatMessage({ isSender, chat, avatarCanShow }: Props) {
  return (
    <div
      className={clsx('flex my-1', {
        'justify-end': isSender,
        'justify-start': !isSender
      })}
    >
      <div className='flex items-end max-w-[50%]'>
        {!isSender && avatarCanShow && (
          <img src={chat.sender?.avatarUrl} alt='avatar' className='size-8 rounded-full' />
        )}
        {!isSender && !avatarCanShow && <div className='size-8'></div>}
        {chat.message && (
          <div
            className={clsx('ml-2 p-2 rounded-3xl max-w-full break-words', {
              'bg-primary text-white': isSender,
              'bg-slate-200': !isSender
            })}
          >
            {chat.message}
          </div>
        )}
        {chat.imageUrl && <img src={chat.imageUrl} alt='user-img' className='ml-2 w-full object-cover' />}
      </div>
    </div>
  )
}
