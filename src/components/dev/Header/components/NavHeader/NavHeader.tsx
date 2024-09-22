import Popover from '@/components/dev/Popover'
import path from '@/constants/path'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

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
      <NavLink
        to={path.home}
        className={({ isActive }) =>
          clsx('inline-block uppercase font-semibold hover:font-bold hover:text-primary hover:transition-all', {
            'text-primary font-bold': isActive
          })
        }
      >
        Trang chủ
      </NavLink>
      <NavLink
        to={path.createQuestion}
        className={({ isActive }) =>
          clsx('inline-block uppercase font-semibold hover:font-bold hover:text-primary hover:transition-all ml-6', {
            'text-primary font-bold': isActive
          })
        }
      >
        Đặt câu hỏi
      </NavLink>
      <NavLink
        to={path.questionLibrary}
        className={({ isActive }) =>
          clsx('inline-block uppercase font-semibold hover:font-bold hover:text-primary hover:transition-all ml-6', {
            'text-primary font-bold': isActive
          })
        }
      >
        Thư viện câu hỏi
      </NavLink>
      <Popover
        renderPopover={
          <ul className='px-6 py-2 text-center'>
            {popoverNavData.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx('inline-block capitalize  hover:text-primary hover:transition-all text-sm mb-2', {
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
        <div className='ml-6 cursor-pointer uppercase font-semibold hover:font-bold hover:text-primary hover:transition-all flex items-center'>
          TƯ VẤN
          <ChevronDownIcon className='ml-1' />
        </div>
      </Popover>
    </nav>
  )
}
