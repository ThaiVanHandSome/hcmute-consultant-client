import clsx from 'clsx'

import registerStatus from '@/constants/registerStatus'
import { EmailIcon, SuccessIcon, UserIcon } from '@/icons'
import { RegisterStatusType } from '@/types/auth.type'

const registerStatusInfo = [
  {
    status: registerStatus.create,
    heading: 'Bước 1',
    description: 'Tạo tài khoản',
    icon: <UserIcon className='size-8' />
  },
  {
    status: registerStatus.confirm,
    heading: 'Bước 2',
    description: 'Xác nhận email',
    icon: <EmailIcon className='size-8' />
  },
  {
    status: registerStatus.success,
    heading: 'Bước 3',
    description: 'Đăng ký thành công',
    icon: <SuccessIcon className='size-8' />
  }
]

interface Props {
  readonly status: RegisterStatusType
}

export default function RegisterStatus({ status }: Props) {
  const checkStatus = (value: RegisterStatusType) => {
    if (value === registerStatus.create) {
      if (status === registerStatus.create) return 'inProgress'
      return 'isSuccess'
    }
    if (value === registerStatus.confirm) {
      if (status === registerStatus.confirm) return 'inProgress'
      if (status === registerStatus.success) return 'isSuccess'
    }
    if (value === registerStatus.success) {
      if (status === registerStatus.success) return 'inProgress'
    }
    return 'normal'
  }

  const renderSuccessIcon = () => (
    <span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
        />
      </svg>
    </span>
  )

  return (
    <div className='flex items-center my-6'>
      {registerStatusInfo.map((item, index) => (
        <div key={item.status} className='flex items-center'>
          <div className='flex items-center'>
            <div className='mr-2 text-2xl flex items-center justify-center'>{item.icon}</div>
            <div>
              <p
                className={clsx('font-bold text-sm flex items-center', {
                  'text-green-500': checkStatus(item.status as RegisterStatusType) === 'isSuccess',
                  'text-cyan-400': checkStatus(item.status as RegisterStatusType) === 'inProgress'
                })}
              >
                <span className='mr-1'>{item.heading}</span>
                {checkStatus(item.status as RegisterStatusType) === 'isSuccess' && renderSuccessIcon()}
              </p>
              <p className='text-gray-500 text-xs'>{item.description}</p>
            </div>
          </div>
          {index < registerStatusInfo.length - 1 && <div className='w-20 mx-4 h-[2px] bg-gray-500' />}
        </div>
      ))}
    </div>
  )
}
