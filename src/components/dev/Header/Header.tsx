import LogoHCMUTE from '@/assets/images/logos/logo_hcmute.png'
import NavHeader from '@/components/dev/Header/components/NavHeader'
import UserPopover from '@/components/dev/Header/components/UserPopover'
import Popover from '@/components/dev/Popover'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import { BellIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'

export default function Header() {
  const { isAuthenticated } = useContext(AppContext)

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
                <div className='px-6 py-3'>
                  <p className='text-sm'>Hiện chưa có thông báo nào!</p>
                </div>
              }
            >
              <BellIcon className='size-6 text-black mr-6' />
            </Popover>
            <Popover
              placement='bottom'
              renderPopover={
                <div className='px-6 py-3'>
                  <p className='text-sm'>Chưa có tin nhắn!</p>
                </div>
              }
            >
              <Link to={path.messages}>
                <ChatBubbleIcon className='size-6 text-black mr-6' />
              </Link>
            </Popover>
            <UserPopover />
          </div>
        )}
      </div>
    </header>
  )
}
