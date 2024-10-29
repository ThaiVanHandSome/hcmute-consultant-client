import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { LoginSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { createSearchParams, Link } from 'react-router-dom'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/apis/auth.api'
import forgotPasswordStatus from '@/constants/forgotPasswordStatus'
import { isAxiosUnprocessableEntity, parseJWT } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'
import { setUserToLocalStorage } from '@/utils/auth'
import InputCustom from '@/components/dev/Form/InputCustom'
import LogoHCMUTE from '@/assets/images/logos/logo_hcmute_3.png'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

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
    <div className='w-full h-remain-screen'>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-8'>
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000
              })
            ]}
          >
            <CarouselContent>
              <CarouselItem>
                <img
                  src='https://th.bing.com/th/id/R.fa287d16523e560b486882e52c82b558?rik=HdjoR1WklJHdQA&pid=ImgRaw&r=0&sres=1&sresct=1'
                  alt='hcmute'
                  className='w-full h-[100vh] bg-cover bg-center'
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src='https://portal.hcmute.edu.vn/static/images/Carousel/bg_lg.png'
                  alt='hcmute'
                  className='w-full h-[100vh] bg-cover bg-center'
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src='https://hoisinhvientphcm.com/wp-content/uploads/2023/04/IMG_1598-scaled.jpg'
                  alt='hcmute'
                  className='w-full h-[100vh] bg-cover bg-center'
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src='https://mtg.1cdn.vn/2020/12/04/eee.jpg'
                  alt='hcmute'
                  className='w-full h-[100vh] bg-cover bg-center'
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        <div className='col-span-4 flex flex-col items-center space-y-4 py-6'>
          <img src={LogoHCMUTE} alt='logo-hcmute' className='size-28' />
          <p className='text-lg uppercase font-semibold'>TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM</p>
          <div className='w-[90%] px-4 py-2 bg-primary-bg rounded-lg mt-6'>
            <p className='font-bold text-2xl text-primary'>ĐĂNG NHẬP</p>
            <p className='my-2 text-sm mb-4 text-gray-500'>Tư vấn và hỗ trợ sinh viên</p>
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
                  className='block text-right text-sm font-bold mb-4 text-primary'
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
                <div className='mt-6 text-center text-sm'>
                  Bạn chưa có tài khoản?{' '}
                  <Link
                    to={{
                      pathname: path.register,
                      search: createSearchParams({
                        status: registerStatus.create
                      }).toString()
                    }}
                    className='font-bold text-primary'
                  >
                    Đăng ký
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
