import { register } from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useQueryParams from '@/hooks/useQueryParams'
import RegisterStatus from '@/pages/Register/components/RegisterStatus'
import { RegisterSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { RegisterStatusType } from '@/types/auth.type'
import ConfirmToken from '@/components/dev/ConfirmToken'
import { useEffect, useRef, useState } from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { SuccessIcon } from '@/icons'

export type RegisterFormData = yup.InferType<typeof RegisterSchema>

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
      }
    })
  }

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
    <div className='flex flex-col items-center'>
      <h1 className='font-bold capitalize mb-4 text-xl'>Đăng ký tài khoản</h1>
      <RegisterStatus status={status as RegisterStatusType} />
      <div className='w-1/2 flex-shrink-0 px-4 py-2 shadow-md rounded'>
        {status === registerStatus.create && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Tên tài khoản</FormLabel>
                    <FormControl>
                      <Input placeholder='Tên tài khoản' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Mật khẩu' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Nhập lại mật khẩu' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='Số điện thoại' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex items-center'
                      >
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='NAM' />
                          </FormControl>
                          <FormLabel className='!mt-0 ml-1'>Nam</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='NU' />
                          </FormControl>
                          <FormLabel className='!mt-0 ml-1'>Nữ</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                <Link to={path.login} className='font-bold'>
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
  )
}
