import { useContext } from 'react'

import { CalendarIcon, DashboardIcon } from '@radix-ui/react-icons'
import { LogOutIcon } from 'lucide-react'

import Popover from '@/components/dev/Popover'
import path from '@/constants/path'
import { QuestionCircle, UserIcon } from '@/icons'
import { AppContext } from '@/contexts/app.context'
import { clearLS } from '@/utils/auth'
import AvatarCustom from '@/components/dev/AvatarCustom'
import PopoverItem from '@/components/dev/Header/components/PopoverItem'

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
      id: 2,
      to: path.mySchedual,
      children: (
        <>
          <CalendarIcon />
          <span className='ml-1'>Lịch tư vấn của tôi</span>
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
        <div className='w-[200px] px-4 py-2 bg-card text-card-foreground z-50'>
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
