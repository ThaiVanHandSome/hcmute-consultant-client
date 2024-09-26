import { useContext } from 'react'

import { DashboardIcon } from '@radix-ui/react-icons'
import { LogOutIcon } from 'lucide-react'

import Popover from '@/components/dev/Popover'
import path from '@/constants/path'
import { QuestionCircle, UserIcon } from '@/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppContext } from '@/contexts/app.context'
import { clearLS } from '@/utils/auth'
import UserPopoverItem from '@/components/dev/Header/components/UserPopover/components/UserPopoverItem'

export default function UserPopover() {
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
      to: path.myQuestions,
      children: (
        <>
          <QuestionCircle />
          <span className='ml-1'>Câu hỏi của tôi</span>
        </>
      ),
      onClick: undefined
    },
    {
      id: 3,
      to: path.userDashBoard,
      children: (
        <>
          <DashboardIcon />
          <span className='ml-1'>Thống kê</span>
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
        <div className='w-[200px] px-4 py-2'>
          <ul>
            {userPopoverData.map((item) => (
              <UserPopoverItem key={item.id} to={item.to} onClick={item.onClick}>
                {item.children}
              </UserPopoverItem>
            ))}
          </ul>
        </div>
      }
    >
      <div className='flex items-center cursor-pointer'>
        <Avatar className='size-9'>
          <AvatarImage src={user?.avatarUrl} alt='avatar' />
          <AvatarFallback>USER</AvatarFallback>
        </Avatar>
        <div className='font-bold text-sm ml-2'>
          {user?.firstName} {user?.lastName}
        </div>
      </div>
    </Popover>
  )
}
