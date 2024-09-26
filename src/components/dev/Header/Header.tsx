import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'

import LogoHCMUTE from '@/assets/images/logos/logo_hcmute.png'
import HeaderNotification from '@/components/dev/Header/components/HeaderNotification'
import NavHeader from '@/components/dev/Header/components/NavHeader'
import UserPopover from '@/components/dev/Header/components/UserPopover/UserPopover'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import HeaderMessage from '@/components/dev/Header/components/HeaderMessage'

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
            <HeaderNotification />
            <HeaderMessage />
            <UserPopover />
          </div>
        )}
      </div>
    </header>
  )
}
