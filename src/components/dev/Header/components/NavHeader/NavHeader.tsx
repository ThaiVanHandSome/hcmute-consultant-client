import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import NavLinkItem from '@/components/dev/Header/components/NavHeader/components/NavLinkItem'
import Popover from '@/components/dev/Popover'
import path from '@/constants/path'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { ROLE } from '@/constants/role'

export default function NavHeader() {
  const { role } = useContext(AppContext)
  const popoverNavData = [
    {
      id: 1,
      path: path.consultants,
      label: 'Ban tư vấn'
    },
    {
      id: 2,
      path: path.consultantEvaluation,
      label: 'Đánh giá ban tư vấn'
    },
    {
      id: 3,
      path: path.scheduleConsultant,
      label: 'Đặt lịch tư vấn'
    }
  ]
  return (
    <nav className='flex items-center space-x-4 ml-4 font-semibold'>
      {role === ROLE.user && (
        <>
          <NavLinkItem to={path.home} label='Trang chủ' />
          <NavLinkItem isEmphasize to={path.createQuestion} label='Đặt câu hỏi' />
          <NavLinkItem to={path.questionLibrary} label='Thư viện câu hỏi' />

          <Popover
            renderPopover={
              <ul className='px-6 py-2 text-center'>
                {popoverNavData.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        clsx(
                          'inline-block capitalize text-foreground hover:text-primary transition-colors text-sm mb-2',
                          {
                            'text-primary font-bold': isActive
                          }
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            }
          >
            <div className='mx-2 cursor-pointer text-foreground hover:text-primary transition-all flex items-center'>
              Tư vấn
              <ChevronDownIcon className='ml-1' />
            </div>
          </Popover>
        </>
      )}
      {role === ROLE.consultant && <NavLinkItem isEmphasize to={path.manageQuestion} label='Quản lý' />}
    </nav>
  )
}
