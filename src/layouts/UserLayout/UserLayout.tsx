import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { CalendarIcon, DashboardIcon } from '@radix-ui/react-icons'

import path from '@/constants/path'
import { PencilSquare, QuestionCircle, UserIcon } from '@/icons'
import UserLayoutHeader from '@/layouts/UserLayout/components/UserLayoutHeader'

const userNavData = [
  {
    id: 1,
    path: path.profile,
    icon: <UserIcon className='size-5' />,
    label: 'Hồ sơ của tôi'
  },
  {
    id: 2,
    path: path.changePassword,
    icon: <PencilSquare className='size-5' />,
    label: 'Thay đổi mật khẩu'
  },
  {
    id: 1,
    path: path.myQuestions,
    icon: <QuestionCircle className='size-5' />,
    label: 'Câu hỏi của tôi'
  },
  {
    id: 1,
    path: path.mySchedual,
    icon: <CalendarIcon className='size-5' />,
    label: 'Lịch tư vấn của tôi'
  },
  {
    id: 1,
    path: path.userDashBoard,
    icon: <DashboardIcon className='size-5' />,
    label: 'Thống kê'
  }
]

export default function UserLayout() {
  return (
    <div className='bg-white'>
      <div className='container'>
        <UserLayoutHeader />
        <div className='grid grid-cols-12'>
          <div className='col-span-3 pr-4'>
            <ul>
              {userNavData.map((item) => (
                <li key={item.id} className='mb-2'>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      clsx('font-semibold w-full px-2 py-2 text-sm flex items-center rounded-md', {
                        'bg-primary text-primary-foreground': isActive,
                        'hover:bg-gray-100': !isActive
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
          <div className='col-span-9 rounded-md shadow px-4 py-2 bg-white'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
