import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'

import LogoHCMUTE from '@/assets/images/logos/logo_hcmute_3.png'
import HeaderNotification from '@/components/dev/Header/components/HeaderNotification'
import NavHeader from '@/components/dev/Header/components/NavHeader'
import UserPopover from '@/components/dev/Header/components/UserPopover/UserPopover'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import HeaderMessage from '@/components/dev/Header/components/HeaderMessage'
import { ModeToggle } from '@/components/dev/ModeToggle/ModeToggle'
import ConsultantPopover from '@/components/dev/Header/components/ConsultantPopover'
import { ROLE } from '@/constants/role'
import { Button } from '@/components/ui/button'
import { Role } from '@/types/user.type'

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
          <div className='flex items-center space-x-4'>
            <Button size='sm' variant='outline'>
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
            </Button>
            <Button size='sm'>
              <Link to={path.login}>Đăng nhập</Link>
            </Button>
          </div>
        )}
        {isAuthenticated && (
          <div className='flex items-center'>
            <HeaderNotification />
            <HeaderMessage />
            <ModeToggle />
            {role === ROLE.user && <UserPopover />}
            {[ROLE.consultant, ROLE.admin, ROLE.advisor].includes(role as Role) && <ConsultantPopover />}
          </div>
        )}
      </div>
    </header>
  )
}
