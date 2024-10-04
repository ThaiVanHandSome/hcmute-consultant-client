import clsx from 'clsx'

import { Chat } from '@/types/chat.type'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EllipsisIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface Props {
  readonly isSender: boolean
  readonly chat: Chat
  readonly avatarCanShow?: boolean
  readonly handleChooseMessageEdit?: (messageId: number, content: string) => void
}

export default function ChatMessage({ isSender, chat, avatarCanShow, handleChooseMessageEdit }: Props) {
  const chooseMessageEdit = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    handleChooseMessageEdit && handleChooseMessageEdit(chat.id, chat.message)
  }

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
            <div className='group flex items-end max-w-[50%]'>
              {isSender && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className='group-hover:flex hidden items-center justify-center h-full'>
                      <EllipsisIcon />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Button variant='ghost' size='sm' className='w-full text-left' onClick={chooseMessageEdit}>
                      Edit
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!isSender && avatarCanShow && <AvatarCustom url={chat.sender.avatarUrl} className='size-8' />}
              {!isSender && !avatarCanShow && <div className='size-8'></div>}
              {chat.message && (
                <div
                  className={clsx('ml-2 p-2 rounded-xl max-w-full break-words', {
                    'bg-primary text-primary-foreground': isSender,
                    'bg-card': !isSender
                  })}
                >
                  {chat.message}
                </div>
              )}
              {chat.imageUrl && <img src={chat.imageUrl} alt='user-img' className='ml-2 w-full object-cover' />}
            </div>
          </TooltipTrigger>
          {/* <TooltipContent>
            <p>{formatDate(chat.date, true)}</p>
          </TooltipContent> */}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
