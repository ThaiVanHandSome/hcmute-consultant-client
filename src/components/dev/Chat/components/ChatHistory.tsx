import { useEffect, useMemo, useRef } from 'react'

import { Chat } from '@/types/chat.type'
import { Conversation, MemberConversation } from '@/types/conversation.type'
import ChatMessage from './ChatMessage'

interface Props {
  readonly conversation?: Conversation
  readonly chatData?: Chat[]
  readonly sender?: MemberConversation
  readonly receivers?: MemberConversation[]
}

export default function GroupedChatMessages({ conversation, chatData, sender, receivers }: Props) {
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

  return (
    <>
      <div className='flex flex-col items-center mt-3'>
        <img
          src={conversation?.isGroup ? sender?.avatarUrl : receivers?.[0].avatarUrl}
          alt='reciever-avatar'
          className='size-44 mb-2'
        />
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
              />
            ))}
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </>
  )
}