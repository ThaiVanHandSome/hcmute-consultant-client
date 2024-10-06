import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { LoginSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { createSearchParams, Link } from 'react-router-dom'
import * as yup from 'yup'
import BackgroundImage from '@/assets/images/backgrounds/background_login.jpg'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/apis/auth.api'
import forgotPasswordStatus from '@/constants/forgotPasswordStatus'
import { isAxiosUnprocessableEntity, parseJWT } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { setUserToLocalStorage } from '@/utils/auth'
import InputCustom from '@/components/dev/Form/InputCustom'

type FormData = yup.InferType<typeof LoginSchema>

export default function Login() {
  const { setIsAuthenticated, setUser, setRole } = useContext(AppContext)
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(LoginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => login(body)
  })

  // handle login process
  const onSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        setIsAuthenticated(true)
        setUser(res.data.data.user)
        setUserToLocalStorage(res.data.data.user)
        const payload = parseJWT(res.data.data.accessToken)
        setRole(payload.authorities)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<{ field: string; message: string }[]>>(error)) {
          const formError = error.response?.data.data
          formError?.forEach(({ field, message }) => {
            form.setError(field as keyof FormData, {
              message: message,
              type: 'server'
            })
          })
        }
      }
    })
  })

  return (
    <div className='relative h-screen bg-cover bg-center' style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <div className='absolute inset-0 bg-black opacity-50'></div>
      <div className='relative z-10 flex items-center justify-center h-full'>
        <div className='w-full max-w-md bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-8'>
          <h1 className='font-bold text-3xl text-center mb-6'>Đăng nhập</h1>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='email' placeholder='Email' label='Email' />
              <InputCustom
                type='password'
                control={form.control}
                name='password'
                placeholder='Mật khẩu'
                label='Mật khẩu'
              />
              <Link
                to={{
                  pathname: path.forgotPassword,
                  search: createSearchParams({
                    status: forgotPasswordStatus.send
                  }).toString()
                }}
                className='block text-right text-sm font-bold mb-4'
              >
                Quên mật khẩu?
              </Link>
              <Button
                isLoading={loginMutation.isPending}
                disabled={loginMutation.isPending}
                type='submit'
                className='w-full py-3 bg-primary rounded-full hover:bg-primary-dark transition-all'
              >
                Đăng nhập
              </Button>
              <div className='mt-6 text-center text-sm text-white'>
                Bạn chưa có tài khoản?{' '}
                <Link
                  to={{
                    pathname: path.register,
                    search: createSearchParams({
                      status: registerStatus.create
                    }).toString()
                  }}
                  className='font-bold text-foreground'
                >
                  Đăng ký
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
