import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import NavLinkItem from '@/components/dev/Header/components/NavHeader/components/NavLinkItem'
import Popover from '@/components/dev/Popover'
import path from '@/constants/path'

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

export default function NavHeader() {
  return (
    <nav className='flex items-center ml-12'>
      <NavLinkItem to={path.home} label='Trang chủ' />
      <NavLinkItem to={path.createQuestion} label='Đặt câu hỏi' />
      <NavLinkItem to={path.questionLibrary} label='Thư viện câu hỏi' />
      <Popover
        renderPopover={
          <ul className='px-6 py-2 text-center'>
            {popoverNavData.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx('inline-block capitalize hover:text-primary hover:transition-all text-sm mb-2', {
                      'text-primary font-bold': isActive
                    })
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        }
      >
        <div className='mx-2 cursor-pointer uppercase font-semibold hover:font-bold hover:text-primary hover:transition-all flex items-center'>
          TƯ VẤN
          <ChevronDownIcon className='ml-1' />
        </div>
      </Popover>
    </nav>
  )
}
