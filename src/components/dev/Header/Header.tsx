import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'

import LogoHCMUTE from '@/assets/images/logos/logo_hcmute_3.png'
import HeaderNotification from '@/components/dev/Header/components/HeaderNotification'
import NavHeader from '@/components/dev/Header/components/NavHeader'
import UserPopover from '@/components/dev/Header/components/UserPopover/UserPopover'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import HeaderMessage from '@/components/dev/Header/components/HeaderMessage'
import { ModeToggle } from '@/components/dev/ModeToggle/ModeToggle'
import ConsultantPopover from '@/components/dev/Header/components/ConsultantPopover'
import { ROLE } from '@/constants/role'
import { ClipboardIcon } from '@radix-ui/react-icons'

export default function Header() {
  const { isAuthenticated, role } = useContext(AppContext)

  return (
    <header className='w-full shadow-lg py-2 px-12 flex items-center justify-between fixed top-0 left-0 z-30 bg-background text-foreground h-header-height'>
      <div className='flex items-center'>
        <a href={path.home}>
          <img src={LogoHCMUTE} alt='logo-hcmute' className='w-12 h-12' />
        </a>

        <NavHeader />
      </div>
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
              className='text-primary hover:text-secondary-foreground transition-colors'
            >
              Đăng ký
            </Link>
            <Separator orientation='vertical' className='mx-4 bg-border h-4' />
            <Link to={path.login} className='text-primary hover:text-secondary-foreground transition-colors'>
              Đăng nhập
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <div className='flex items-center'>
            <HeaderNotification />
            <HeaderMessage />
            {role === ROLE.consultant && (
              <Link to={path.manageQuestion}>
                <ClipboardIcon className='size-6 text-foreground mr-2' />
              </Link>
            )}
            <ModeToggle />
            {role === ROLE.user && <UserPopover />}
            {role === ROLE.consultant && <ConsultantPopover />}
          </div>
        )}
      </div>
    </header>
  )
}
