import Header from '@/components/dev/Header'
import path from '@/constants/path'
import { QuestionCircle } from '@/icons'
import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

const asideNavData = [
  {
    path: path.manageQuestion,
    icon: <QuestionCircle className='size-6' />
  }
]

export default function ManageLayout() {
  return (
    <div>
      <Header />
      <div className='grid grid-cols-12 gap-4 bg-primary-bg mt-[var(--header-height)] min-h-remain-screen pt-2'>
        <div className='col-span-1 flex flex-col items-center space-y-4 border-r'>
          {asideNavData.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx('px-3 py-1 rounded-md block text-xl', {
                  'bg-secondary text-secondary-foreground': isActive
                })
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
        <div className='col-span-11 px-6 '>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
