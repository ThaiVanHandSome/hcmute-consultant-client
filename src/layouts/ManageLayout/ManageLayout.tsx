import Header from '@/components/dev/Header'
import path from '@/constants/path'
import { QuestionCircle } from '@/icons'
import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

const asideNavData = [
  {
    path: path.manageQuestion,
    icon: <QuestionCircle className='size-5' />,
    label: 'Câu hỏi'
  }
]

export default function ManageLayout() {
  return (
    <div>
      <Header />
      <div className='gap-2 bg-background mt-[var(--header-height)] min-h-remain-screen relative'>
        <div className='w-[230px] fixed top-[var(--header-height)] left-0 bottom-0 flex flex-col items-center space-y-4 bg-background py-4 px-2'>
          {asideNavData.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-1 rounded-md text-sm flex items-center justify-start gap-2 hover:bg-secondary hover:text-secondary-foreground transition-all w-full ',
                  {
                    'bg-primary text-primary-foreground font-semibold': isActive
                  }
                )
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </div>
        <div className='px-6 py-2 rounded-3xl'>
          <div className='ml-[230px] px-4 py-2 rounded-3xl bg-primary-bg'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
