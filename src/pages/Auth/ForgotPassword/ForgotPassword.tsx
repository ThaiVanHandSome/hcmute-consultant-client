import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '@/constants/path'
import forgotPasswordStatus from '@/constants/forgotPasswordStatus'
import ConfirmToken from '@/components/dev/ConfirmToken'
import { useEffect, useState } from 'react'
import useQueryParams from '@/hooks/useQueryParams'
import ChangePasswordWhenForgot from '@/pages/Auth/ForgotPassword/components/ChangePasswordWhenForgot'
import EmailForm from '@/pages/Auth/ForgotPassword/components/EmailForm'

export default function ForgotPassword() {
  const { status, email } = useQueryParams()
  const [token, setToken] = useState<string>('')

  const navigate = useNavigate()
  const [isConfirmSuccess, setIsConfirmSuccess] = useState<boolean>(false)

  // if confirm token success, switch to next step
  useEffect(() => {
    if (isConfirmSuccess) {
      navigate({
        pathname: path.forgotPassword,
        search: createSearchParams({
          status: forgotPasswordStatus.changePassword,
          email,
          token
        }).toString()
      })
    }
  }, [isConfirmSuccess, navigate])

  return (
    <div className='h-[100vh]'>
      <div className='grid grid-cols-12 h-full'>
        <div className='col-span-12 lg:col-span-5 px-6 py-4'>
          <h1 className='font-bold text-xl mb-4 text-center'>Quên mật khẩu</h1>
          {status === forgotPasswordStatus.send && <EmailForm />}
          {status === forgotPasswordStatus.confirm && (
            <ConfirmToken setToken={setToken} setIsConfirmSuccess={setIsConfirmSuccess} />
          )}
          {status === forgotPasswordStatus.changePassword && <ChangePasswordWhenForgot />}
        </div>
        <div className='hidden lg:block col-span-7'>
          <img src='https://mtg.1cdn.vn/2020/12/04/eee.jpg' alt='bg' className='w-full h-full bg-center' />
        </div>
      </div>
    </div>
  )
}
