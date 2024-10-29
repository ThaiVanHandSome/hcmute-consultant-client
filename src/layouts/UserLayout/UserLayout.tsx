import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { CalendarIcon, DashboardIcon, RulerHorizontalIcon } from '@radix-ui/react-icons'

import path from '@/constants/path'
import { PencilSquare, QuestionCircle, UserIcon } from '@/icons'
import UserLayoutHeader from '@/layouts/UserLayout/components/UserLayoutHeader'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { ROLE } from '@/constants/role'

export default function UserLayout() {
  const { role } = useContext(AppContext)

  const userNavData = [
    {
      id: 1,
      path: path.profile,
      icon: <UserIcon className='size-5' />,
      label: 'Hồ sơ của tôi',
      hidden: false
    },
    {
      id: 2,
      path: path.changePassword,
      icon: <PencilSquare className='size-5' />,
      label: 'Thay đổi mật khẩu',
      hidden: false
    },
    {
      id: 1,
      path: path.myQuestions,
      icon: <QuestionCircle className='size-5' />,
      label: 'Câu hỏi của tôi',
      hidden: role !== ROLE.user
    },
    {
      id: 1,
      path: path.mySchedual,
      icon: <CalendarIcon className='size-5' />,
      label: 'Lịch tư vấn của tôi',
      hidden: role !== ROLE.user
    },
    {
      id: 1,
      path: path.myRating,
      icon: <RulerHorizontalIcon className='size-5' />,
      label: 'Đánh giá của tôi',
      hidden: role !== ROLE.user
    },
    {
      id: 1,
      path: role === ROLE.user ? path.userDashBoard : path.consultantDashboard,
      icon: <DashboardIcon className='size-5' />,
      label: 'Thống kê',
      hidden: false
    }
  ]

  const newUserNavData = userNavData.filter((item) => item.hidden === false)

  return (
    <div className='bg-primary-bg text-foreground min-h-remain-screen'>
      <div className='container'>
        <UserLayoutHeader />
        <div className='grid grid-cols-12'>
          <div className='col-span-3 pr-4'>
            <ul>
              {newUserNavData.map((item) => (
                <li key={item.id} className='mb-2'>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      clsx('font-semibold w-full px-2 py-2 text-sm flex items-center rounded-md', {
                        'bg-primary text-primary-foreground': isActive,
                        'hover:bg-card hover:text-card-foreground': !isActive
                      })
                    }
                  >
                    {item.icon}
                    <span className='ml-1'>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className='col-span-9 shadow-xl px-4 py-2 bg-background text-foreground rounded-lg'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
