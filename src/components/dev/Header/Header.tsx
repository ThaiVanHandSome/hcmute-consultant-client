import { getConversations } from '@/apis/conversation.api'
import { getNotifications } from '@/apis/notification.api'
import LogoHCMUTE from '@/assets/images/logos/logo_hcmute.png'
import NavHeader from '@/components/dev/Header/components/NavHeader'
import UserPopover from '@/components/dev/Header/components/UserPopover'
import Popover from '@/components/dev/Popover'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'
import { formatDate } from '@/utils/utils'
import { BellIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'

export default function Header() {
  const { isAuthenticated } = useContext(AppContext)

  const conversationQueryParams = useConversationQueryConfig()
  const { data: conversations } = useQuery({
    queryKey: ['conversations', conversationQueryParams],
    queryFn: () => getConversations(conversationQueryParams)
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  return (
    <header className='w-full shadow-lg py-2 px-12 flex items-center justify-between fixed top-0 left-0 z-30 bg-white h-header-height'>
      <div className='flex items-center'>
        <a href={path.home}>
          <img src={LogoHCMUTE} alt='logo-hcmute' className='size-16 object-fit' />
        </a>
      </div>
      <NavHeader />
      <div className='flex items-center'>
        {!isAuthenticated && (
          <div className='flex items-center'>
            <Link
              to={{
                pathname: path.register,
                search: createSearchParams({
                  status: registerStatus.create
                }).toString()
              }}
            >
              Đăng ký
            </Link>
            <Separator orientation='vertical' className='mx-4 bg-gray-500 h-4' />
            <Link to={path.login}>Đăng nhập</Link>
          </div>
        )}
        {isAuthenticated && (
          <div className='flex items-center'>
            <Popover
              placement='bottom'
              renderPopover={
                <ul className='px-6 py-3'>
                  {!notifications && <p className='text-sm'>Hiện chưa có thông báo nào!</p>}
                  {notifications?.data.data.slice(0, 5).map((notification) => (
                    <li key={notification.id} className='py-2 border-b border-gray-300 group'>
                      <p className='group-hover:text-primary font-semibold mb-1 cursor-default'>
                        {notification.content}
                      </p>
                      <p className='text-xs text-slate-500'>{formatDate(notification.time, true)}</p>
                    </li>
                  ))}
                </ul>
              }
            >
              <div className='relative'>
                <BellIcon className='size-6 text-black mr-6' />
                <p className='size-5 text-xs rounded-full bg-destructive text-white flex items-center justify-center absolute top-0 right-1 -translate-x-1/2 -translate-y-1/2'>
                  {notifications?.data.data.length}
                </p>
              </div>
            </Popover>
            <Link to={path.messages} className='inline-block relative'>
              <ChatBubbleIcon className='size-6 text-black mr-6' />
              <p className='size-5 text-xs rounded-full bg-destructive text-white flex items-center justify-center absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2'>
                {conversations?.data.data.content.length}
              </p>
            </Link>
            <UserPopover />
          </div>
        )}
      </div>
    </header>
  )
}
