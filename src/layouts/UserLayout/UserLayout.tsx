import path from '@/constants/path'
import { PencilSquare, QuestionCircle, UserIcon } from '@/icons'
import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div className='bg-primary-bg min-h-[100vh]'>
      <div className='container'>
        <div className='grid grid-cols-12'>
          <div className='col-span-3 py-16 px-4'>
            <ul>
              <li className='mb-2'>
                <NavLink
                  to={path.profile}
                  className={({ isActive }) =>
                    clsx('font-bold w-full px-2 py-1 flex items-center', {
                      'text-primary': isActive
                    })
                  }
                >
                  <UserIcon className='size-5' />
                  <span className='ml-1'>Hồ sơ của tôi</span>
                </NavLink>
              </li>
              <li className='mb-2'>
                <NavLink
                  to={path.changePassword}
                  className={({ isActive }) =>
                    clsx('font-bold w-full px-2 py-1 flex items-center', {
                      'text-primary': isActive
                    })
                  }
                >
                  <PencilSquare className='size-5' />
                  <span className='ml-1'>Thay đổi mật khẩu</span>
                </NavLink>
              </li>
              <li className='mb-2'>
                <NavLink
                  to={path.myQuestions}
                  className={({ isActive }) =>
                    clsx('font-bold w-full px-2 py-1 flex items-center', {
                      'text-primary': isActive
                    })
                  }
                >
                  <QuestionCircle className='size-5' />
                  <span className='ml-1'>Câu hỏi của tôi</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='mt-12 col-span-9 rounded-md shadow px-4 py-2 bg-white'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
