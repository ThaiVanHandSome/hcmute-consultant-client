import { useEffect, useState } from 'react'

import { createSearchParams, Link, useNavigate } from 'react-router-dom'

import useQueryParams from '@/hooks/useQueryParams'
import ConfirmToken from '@/components/dev/ConfirmToken'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { SuccessIcon } from '@/icons'
import RegisterStatus from '@/pages/Auth/Register/components/RegisterStatus'
import { RegisterStatusType } from '@/types/auth.type'
import RegisterForm from '@/pages/Auth/Register/components/RegisterForm'

export default function Register() {
  const { status } = useQueryParams()

  const [isConfirmSuccess, setIsConfirmSuccess] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')

  const navigate = useNavigate()

  // if confirm token success, switch to next step
  useEffect(() => {
    if (isConfirmSuccess) {
      navigate({
        pathname: path.register,
        search: createSearchParams({
          status: registerStatus.success
        }).toString()
      })
    }
  }, [isConfirmSuccess, navigate])

  return (
    <div className='bg-primary-bg'>
      <div className='container '>
        <div className='flex flex-col items-center py-6'>
          <h1 className='font-bold capitalize mb-4 text-xl'>Đăng ký tài khoản</h1>
          <RegisterStatus status={status as RegisterStatusType} />
          <div className='w-2/3 flex-shrink-0 px-4 py-2 shadow-md rounded'>
            {status === registerStatus.create && <RegisterForm setEmail={setEmail} />}
            {status === registerStatus.confirm && (
              <ConfirmToken email={email} setIsConfirmSuccess={setIsConfirmSuccess} />
            )}
            {status === registerStatus.success && (
              <div className='flex flex-col items-center'>
                <SuccessIcon className='size-44 text-green-500' />
                <p className='font-bold text-lg mb-3'>Đăng ký thành công</p>
                <Link to={path.login} className='block px-4 py-2 rounded bg-primary text-primary-foreground text-sm'>
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
