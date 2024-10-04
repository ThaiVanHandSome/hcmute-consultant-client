import { useEffect, useMemo, useRef } from 'react'

import ChatMessage from './ChatMessage'
import { Chat } from '@/types/chat.type'
import { Conversation, MemberConversation } from '@/types/conversation.type'
import AvatarCustom from '@/components/dev/AvatarCustom'

interface Props {
  readonly conversation?: Conversation
  readonly chatData?: Chat[]
  readonly sender?: MemberConversation
  readonly receivers?: MemberConversation[]
  readonly setMessageEdit?: React.Dispatch<
    React.SetStateAction<
      | {
          messageId: number
          content: string
        }
      | undefined
    >
  >
}

export default function GroupedChatMessages({ conversation, chatData, sender, receivers, setMessageEdit }: Props) {
  const groupedMessages = useMemo(() => {
    if (!chatData || chatData.length === 0) return []

    const grouped: Chat[][] = []
    let currentGroup: Chat[] = []

    for (const element of chatData) {
      const chat = element
      if (currentGroup.length === 0) {
        currentGroup.push(chat)
      } else {
        const lastChatInGroup = currentGroup[currentGroup.length - 1]

        // check if current user id equal previous user id
        if (chat.sender.id === lastChatInGroup.sender.id) {
          currentGroup.push(chat)
        } else {
          grouped.push([...currentGroup]) // save message group
          currentGroup = [chat] // create new group
        }
      }
    }

    // push the last group
    if (currentGroup.length > 0) {
      grouped.push([...currentGroup])
    }

    return grouped
  }, [chatData, sender])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [conversation, chatData])

  const handleChooseMessageEdit = (messageId: number, content: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setMessageEdit &&
      setMessageEdit({
        messageId,
        content
      })
  }

  return (
    <>
      <div className='flex flex-col items-center mt-3'>
        <AvatarCustom url={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0].avatarUrl} className='size-44' />
        <p className='font-bold text-xl'>{conversation?.isGroup ? conversation.name : receivers?.[0].name}</p>
      </div>
      {groupedMessages.map((group) => {
        const isSender = group[0].sender.id === sender?.id
        const avatarCanShow = true

        return (
          <div key={group[0].id} className='my-3'>
            {group.map((chat, chatIndex) => (
              <ChatMessage
                key={chat.id}
                isSender={isSender}
                avatarCanShow={chatIndex === 0 && avatarCanShow}
                chat={chat}
                handleChooseMessageEdit={handleChooseMessageEdit}
              />
            ))}
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </>
  )
}
