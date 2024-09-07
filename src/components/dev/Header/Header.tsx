import LogoHCMUTE from '@/assets/images/logos/logo_hcmute.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import clsx from 'clsx'
import { useContext } from 'react'
import { Link, NavLink, createSearchParams } from 'react-router-dom'

export default function Header() {
  const { isAuthenticated, user } = useContext(AppContext)
  return (
    <header className='w-full shadow-lg py-2 px-12 flex items-center justify-between fixed top-0 left-0 z-40 bg-white h-header-height'>
      <div>
        <img src={LogoHCMUTE} alt='logo-hcmute' className='size-20' />
      </div>
      <div className='flex items-center'>
        <nav className='flex items-center mr-8'>
          <NavLink
            to={path.createQuestion}
            className={({ isActive }) =>
              clsx('inline-block font-bold hover:border-b-2 hover:border-gray-600 hover:transition-all', {
                'border-b-2 border-gray-600': isActive
              })
            }
          >
            Đặt câu hỏi
          </NavLink>
        </nav>
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
            <Avatar>
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>USER</AvatarFallback>
            </Avatar>
            <div className='font-bold text-sm ml-2'>
              {user?.firstName} {user?.lastName}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
