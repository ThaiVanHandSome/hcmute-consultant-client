import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { toast } from 'react-toastify'
import forgotPasswordStatus from '@/constants/forgotPasswordStatus'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { setUserToLocalStorage } from '@/utils/auth'

type FormData = yup.InferType<typeof LoginSchema>

export default function Login() {
  const { setIsAuthenticated, setUser } = useContext(AppContext)
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

  const onSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        setIsAuthenticated(true)
        setUser(res.data.data.user)
        setUserToLocalStorage(res.data.data.user)
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
    <div className='h-[100vh]'>
      <div className='grid grid-cols-12 h-full'>
        <div className='col-span-5 px-4 py-6'>
          <div className='shadow-lg rounded-lg px-6 py-4 bg-white'>
            <h1 className='font-bold text-xl mb-4 text-center'>Đăng nhập</h1>
            <div>
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem className='mt-4'>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder='Mật khẩu' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link
                    to={{
                      pathname: path.forgotPassword,
                      search: createSearchParams({
                        status: forgotPasswordStatus.send
                      }).toString()
                    }}
                    className='inline-block font-bold mt-2 text-sm'
                  >
                    Quên mật khẩu?
                  </Link>
                  <Button
                    isLoading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                    type='submit'
                    className='w-full mt-4'
                  >
                    Đăng nhập
                  </Button>
                  <div className='mt-3 text-center text-sm'>
                    Bạn chưa có tài khoản?{' '}
                    <Link
                      to={{
                        pathname: path.register,
                        search: createSearchParams({
                          status: registerStatus.create
                        }).toString()
                      }}
                      className='font-bold'
                    >
                      Đăng ký
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className='col-span-7'>
          <img src={BackgroundImage} alt='bg' className='w-full h-full bg-center' />
        </div>
      </div>
    </div>
  )
}
