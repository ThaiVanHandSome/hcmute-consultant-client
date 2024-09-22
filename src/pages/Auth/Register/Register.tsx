import { register } from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useQueryParams from '@/hooks/useQueryParams'
import { RegisterSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import * as yup from 'yup'
import { RegisterStatusType } from '@/types/auth.type'
import ConfirmToken from '@/components/dev/ConfirmToken'
import { useEffect, useRef, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { SuccessIcon } from '@/icons'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { ErrorResponse, FormControlItem } from '@/types/utils.type'
import RegisterStatus from '@/pages/Auth/Register/components/RegisterStatus'
import InputCustom from '@/components/dev/Form/InputCustom'
import RadioGroupCustom from '@/components/dev/Form/RadioGroupCustom'
import { useForm } from 'react-hook-form'

export type RegisterFormData = yup.InferType<typeof RegisterSchema>

const radioGroupData: FormControlItem[] = [
  {
    value: 'NAM',
    label: 'Nam'
  },
  {
    value: 'NU',
    label: 'Nữ'
  }
]

export default function Register() {
  const { status } = useQueryParams()
  const [isConfirmSuccess, setIsConfirmSuccess] = useState<boolean>(false)
  const navigate = useNavigate()
  const emailRegisterRef = useRef('')
  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'NAM',
      phone: ''
    },
    resolver: yupResolver(RegisterSchema)
  })

  const registerMutation = useMutation({
    mutationFn: (body: RegisterFormData) => register(body)
  })

  // handle register process
  const onSubmit = (values: RegisterFormData) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        emailRegisterRef.current = form.watch('email')
        navigate({
          pathname: path.register,
          search: createSearchParams({
            status: registerStatus.confirm
          }).toString()
        })
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<{ field: string; message: string }[]>>(error)) {
          const formError = error.response?.data.data
          formError?.forEach(({ field, message }) => {
            form.setError(field as keyof RegisterFormData, {
              message: message,
              type: 'server'
            })
          })
        }
      }
    })
  }

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
    <div className='container'>
      <div className='flex flex-col items-center py-6'>
        <h1 className='font-bold capitalize mb-4 text-xl'>Đăng ký tài khoản</h1>
        <RegisterStatus status={status as RegisterStatusType} />
        <div className='w-2/3 flex-shrink-0 px-4 py-2 shadow-md rounded'>
          {status === registerStatus.create && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <InputCustom control={form.control} name='username' placeholder='Username' label='Tên tài khoản' />
                <InputCustom control={form.control} name='email' placeholder='Email' label='Email' />
                <InputCustom
                  type='password'
                  control={form.control}
                  name='password'
                  placeholder='Mật khẩu'
                  label='Mật khẩu'
                />
                <InputCustom
                  type='password'
                  control={form.control}
                  name='confirmPassword'
                  placeholder='Nhập lại mật khẩu'
                  label='Nhập lại mật khẩu'
                />
                <InputCustom control={form.control} name='phone' placeholder='Số điện thoại' label='Số điện thoại' />
                <RadioGroupCustom
                  control={form.control}
                  name='gender'
                  label='Giới tính'
                  data={radioGroupData}
                  defaultValue='NAM'
                />
                <Button
                  isLoading={registerMutation.isPending}
                  disabled={registerMutation.isPending}
                  className='w-full'
                  type='submit'
                >
                  Đăng ký
                </Button>
                <div className='mt-3 text-center text-sm'>
                  Bạn đã có tài khoản?{' '}
                  <Link to={path.login} className='font-bold text-primary'>
                    Đăng nhập
                  </Link>
                </div>
              </form>
            </Form>
          )}
          {status === registerStatus.confirm && (
            <ConfirmToken email={emailRegisterRef.current} setIsConfirmSuccess={setIsConfirmSuccess} />
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
  )
}
