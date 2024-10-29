import { useContext } from 'react'

import { DashboardIcon } from '@radix-ui/react-icons'
import { ChartNoAxesGantt, LogOutIcon } from 'lucide-react'

import Popover from '@/components/dev/Popover'
import path from '@/constants/path'
import { UserIcon } from '@/icons'
import { AppContext } from '@/contexts/app.context'
import { clearLS } from '@/utils/auth'
import AvatarCustom from '@/components/dev/AvatarCustom'
import PopoverItem from '@/components/dev/Header/components/PopoverItem'

export default function ConsultantPopover() {
  const { setIsAuthenticated, user, setUser, setRole } = useContext(AppContext)

  const handleLogout = () => {
    clearLS()
    setIsAuthenticated(false)
    setUser(null)
    setRole('')
  }

  const userPopoverData = [
    {
      id: 1,
      to: path.profile,
      children: (
        <>
          <UserIcon /> <span className='ml-1'>Hồ sơ cá nhân</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 2,
      to: path.consultantDashboard,
      children: (
        <>
          <DashboardIcon />
          <span className='ml-1'>Thống kê</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 3,
      to: path.manageQuestion,
      children: (
        <>
          <ChartNoAxesGantt className='size-5' strokeWidth={1.25} />
          <span className='ml-1'>Quản lý</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 4,
      to: undefined,
      children: (
        <>
          <LogOutIcon className='size-4 text-sm' />
          <span className='ml-1'>Đăng xuất</span>
        </>
      ),
      onClick: handleLogout
    }
  ]

  return (
    <Popover
      placement='bottom'
      renderPopover={
        <div className='w-[200px] px-4 py-2 bg-card text-card-foreground'>
          <ul>
            {userPopoverData.map((item) => (
              <PopoverItem key={item.id} to={item.to} onClick={item.onClick}>
                {item.children}
              </PopoverItem>
            ))}
          </ul>
        </div>
      }
    >
      <div className='flex items-center cursor-pointer'>
        <AvatarCustom url={user?.avatarUrl} />
      </div>
    </Popover>
  )
}
