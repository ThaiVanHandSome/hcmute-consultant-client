import clsx from 'clsx'

import { Chat } from '@/types/chat.type'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EllipsisIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import DialogUnsend from '@/components/dev/Chat/components/DialogUnsend'
import DialogRemoveMessage from '@/components/dev/Chat/components/DialogRemoveMessage'

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

  const isHidden = chat.recalledBySender && !chat.recalledForEveryone && isSender
  const isShowRecalled = chat.recalledForEveryone

  return (
    <>
      {!isHidden && (
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
                        <div
                          aria-hidden='true'
                          className='w-full px-2 py-1 text-sm cursor-pointer'
                          onClick={chooseMessageEdit}
                        >
                          Chỉnh sửa
                        </div>
                        <DialogUnsend messageId={chat.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {!isSender && avatarCanShow && <AvatarCustom url={chat.sender.avatarUrl} className='size-8' />}
                  {!isSender && !avatarCanShow && <div className='size-8'></div>}
                  {chat.message && (
                    <div
                      className={clsx('ml-2 p-2 rounded-xl max-w-full break-words', {
                        'bg-primary text-primary-foreground': isSender && !isShowRecalled,
                        'bg-secondary text-secondary-foreground': !isSender && !isShowRecalled,
                        'px-4 py-1 shadow my-1 text-sm italic bg-secondary text-secondary-foreground': isShowRecalled
                      })}
                    >
                      {chat.message}
                    </div>
                  )}
                  {chat.imageUrl && !isShowRecalled && (
                    <img src={chat.imageUrl} alt='user-img' className='ml-2 w-full object-cover' />
                  )}
                  {!isSender && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className='group-hover:flex hidden items-center justify-center h-full'>
                          <EllipsisIcon />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DialogRemoveMessage messageId={chat.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </TooltipTrigger>
              {/* <TooltipContent>
              <p>{formatDate(chat.date, true)}</p>
            </TooltipContent> */}
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )
}
