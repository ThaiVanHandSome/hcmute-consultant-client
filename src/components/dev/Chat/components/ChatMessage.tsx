import clsx from 'clsx'
import { Chat } from '@/types/chat.type'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { MoreHorizontal, Pencil } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import DialogUnsend from '@/components/dev/Chat/components/DialogUnsend'
import DialogRemoveMessage from '@/components/dev/Chat/components/DialogRemoveMessage'
import { formatDate } from '@/utils/utils'

interface Props {
  readonly isSender: boolean
  readonly chat: Chat
  readonly avatarCanShow?: boolean
  readonly handleChooseMessageEdit?: (messageId: number, content: string) => void
}

export default function ChatMessage({ isSender, chat, avatarCanShow, handleChooseMessageEdit }: Props) {
  const chooseMessageEdit = () => {
    handleChooseMessageEdit?.(chat.id, chat.message)
  }

  const isHidden = chat.recalledBySender && !chat.recalledForEveryone && isSender
  const isShowRecalled = chat.recalledForEveryone

  if (isHidden) return null

  return (
    <div className='relative group py-2'>
      {/* Avatar & User Info */}
      {avatarCanShow && chat.message && (
        <div
          className={clsx('flex items-end gap-2 mb-1', {
            'flex-row-reverse mr-12': isSender,
            'ml-12': !isSender
          })}
        >
          <AvatarCustom
            url={chat.sender.avatarUrl}
            className='size-6 ring-1 ring-offset-1 ring-primary/20 transition-transform hover:scale-105'
          />
          <div
            className={clsx('flex gap-2 items-center text-xs text-muted-foreground/80', {
              'flex-row-reverse': isSender
            })}
          >
            <span className='font-medium'>
              {chat.sender.name} {isSender && '(You)'}
            </span>
            <span className='text-[10px]'>{formatDate(chat.date, true)}</span>
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={clsx('flex items-end gap-2', {
          'justify-end': isSender,
          'justify-start': !isSender
        })}
      >
        {/* Message Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={clsx(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              'focus-visible:outline-none p-1 rounded-full hover:bg-secondary'
            )}
          >
            <MoreHorizontal className='size-4 text-muted-foreground' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isSender ? 'end' : 'start'} className='w-36 p-1'>
            {isSender && !chat.imageUrl && (
              <DropdownMenuItem onClick={chooseMessageEdit} className='gap-2'>
                <Pencil className='size-3.5' />
                <span>Edit message</span>
              </DropdownMenuItem>
            )}
            {isSender ? <DialogUnsend messageId={chat.id} /> : <DialogRemoveMessage messageId={chat.id} />}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Message Bubble */}
        <div className='max-w-[60%] flex flex-col gap-1'>
          {chat.message && (
            <div
              className={clsx(
                'px-4 py-2.5 rounded-2xl text-sm transition-all duration-200',
                'break-words leading-relaxed tracking-wide',
                {
                  'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground': isSender && !isShowRecalled,
                  'bg-secondary/80 hover:bg-secondary text-secondary-foreground': !isSender && !isShowRecalled,
                  'px-3 py-2 text-xs italic bg-secondary/40 text-muted-foreground': isShowRecalled
                }
              )}
            >
              {chat.message}
            </div>
          )}

          {/* Image Message */}
          {chat.imageUrl && !isShowRecalled && (
            <div className='relative group/image'>
              <img
                src={chat.imageUrl}
                alt='Message attachment'
                className={clsx(
                  'max-w-sm rounded-lg shadow-sm object-cover',
                  'transition duration-200',
                  'hover:shadow-md hover:scale-[1.02]',
                  'cursor-zoom-in'
                )}
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg' />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
