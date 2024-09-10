import LogoHCMUTE from '@/assets/images/logos/logo_hcmute.png'
import Popover from '@/components/dev/Popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { AppContext } from '@/contexts/app.context'
import { clearLS } from '@/utils/auth'
import clsx from 'clsx'
import { useContext } from 'react'
import { Link, NavLink, createSearchParams } from 'react-router-dom'

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(AppContext)

  const handleLogout = () => {
    clearLS()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <header className='w-full shadow-lg py-2 px-12 flex items-center justify-between fixed top-0 left-0 z-30 bg-white h-header-height'>
      <div className='flex items-center'>
        <a href={path.home}>
          <img src={LogoHCMUTE} alt='logo-hcmute' className='size-20' />
        </a>
        <nav className='flex items-center ml-12'>
          <NavLink
            to={path.createQuestion}
            className={({ isActive }) =>
              clsx('inline-block uppercase font-semibold hover:font-bold hover:text-primary hover:transition-all', {
                'text-primary font-bold': isActive
              })
            }
          >
            Đặt câu hỏi
          </NavLink>
        </nav>
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
            >
              Đăng ký
            </Link>
            <Separator orientation='vertical' className='mx-4 bg-gray-500 h-4' />
            <Link to={path.login}>Đăng nhập</Link>
          </div>
        )}
        {isAuthenticated && (
          <Popover
            placement='bottom'
            renderPopover={
              <div className='w-[200px] px-4 py-2'>
                <ul>
                  <li
                    aria-hidden='true'
                    className='cursor-pointer hover:font-bold hover:transition-all hover:text-primary text-sm'
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </div>
            }
          >
            <div className='flex items-center cursor-pointer'>
              <Avatar>
                <AvatarImage
                  src='https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=Tfkhgvffv3cQ7kNvgERMbSU&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=ADHfltbhANdWHLfZtFl-Hqm&oh=00_AYDYXIj0aYVvkcSodbUivsAJUDUuTAQLGcbUF-sBdafZwQ&oe=66E1DC27'
                  alt='avatar'
                />
                <AvatarFallback>USER</AvatarFallback>
              </Avatar>
              <div className='font-bold text-sm ml-2'>
                {user?.firstName} {user?.lastName}
              </div>
            </div>
          </Popover>
        )}
      </div>
    </header>
  )
}
