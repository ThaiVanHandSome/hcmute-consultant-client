import Popover from '@/components/dev/Popover'
import path from '@/constants/path'
import { Link } from 'react-router-dom'
import { QuestionCircle, UserIcon } from '@/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DashboardIcon } from '@radix-ui/react-icons'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { clearLS } from '@/utils/auth'
import { LogOutIcon } from 'lucide-react'

export default function UserPopover() {
  const { setIsAuthenticated, user, setUser, setRole } = useContext(AppContext)

  const handleLogout = () => {
    clearLS()
    setIsAuthenticated(false)
    setUser(null)
    setRole('')
  }
  return (
    <Popover
      placement='bottom'
      renderPopover={
        <div className='w-[200px] px-4 py-2'>
          <ul>
            <li className='hover:font-bold hover:transition-all hover:text-primary text-sm py-2 border-b border-b-slate-300'>
              <Link to={path.profile} className='flex items-center'>
                <UserIcon /> <span className='ml-1'>Hồ sơ cá nhân</span>
              </Link>
            </li>
            <li className='hover:font-bold hover:transition-all hover:text-primary text-sm py-2 border-b border-b-slate-300'>
              <Link to={path.myQuestions} className='flex items-center'>
                <QuestionCircle />
                <span className='ml-1'>Câu hỏi của tôi</span>
              </Link>
            </li>
            <li className='hover:font-bold hover:transition-all hover:text-primary text-sm py-2 border-b border-b-slate-300'>
              <Link to={path.userDashBoard} className='flex items-center'>
                <DashboardIcon />
                <span className='ml-1'>Thống kê</span>
              </Link>
            </li>
            <li
              aria-hidden='true'
              className='cursor-pointer hover:font-bold hover:transition-all hover:text-primary text-sm py-2 flex items-center'
              onClick={handleLogout}
            >
              <LogOutIcon className='size-4 text-sm' />
              <span className='ml-1'>Đăng xuất</span>
            </li>
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
