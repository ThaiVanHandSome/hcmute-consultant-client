import clsx from 'clsx'

import { Chat } from '@/types/chat.type'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate } from '@/utils/utils'

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='flex items-end max-w-[50%]'>
              {!isSender && avatarCanShow && <AvatarCustom url={chat.sender.avatarUrl} className='size-8' />}
              {!isSender && !avatarCanShow && <div className='size-8'></div>}
              {chat.message && (
                <div
                  className={clsx('ml-2 p-2 rounded-xl max-w-full break-words', {
                    'bg-primary text-white': isSender,
                    'bg-slate-200': !isSender
                  })}
                >
                  {chat.message}
                </div>
              )}
              {chat.imageUrl && <img src={chat.imageUrl} alt='user-img' className='ml-2 w-full object-cover' />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formatDate(chat.date, true)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
