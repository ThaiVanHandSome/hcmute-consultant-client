import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ForgotPasswordSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import BackgroundImage from '@/assets/images/backgrounds/background_login.jpg'
import { useMutation } from '@tanstack/react-query'
import { resetPassword, sendCodeToEmailToChangePassword } from '@/apis/auth.api'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '@/constants/path'
import forgotPasswordStatus from '@/constants/forgotPasswordStatus'
import ConfirmToken from '@/components/dev/ConfirmToken'
import { useEffect, useRef, useState } from 'react'
import useQueryParams from '@/hooks/useQueryParams'
import { toast } from 'react-toastify'

type SendEmailFormData = Pick<yup.InferType<typeof ForgotPasswordSchema>, 'email'>
const SendEmailSchema = ForgotPasswordSchema.pick(['email'])

type ChangePasswordFormData = Omit<yup.InferType<typeof ForgotPasswordSchema>, 'email'>
const ChangePasswordSchema = ForgotPasswordSchema.omit(['email'])

export default function ForgotPassword() {
  const { status } = useQueryParams()
  const sendEmailForm = useForm<SendEmailFormData>({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(SendEmailSchema)
  })

  const changePasswordForm = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    resolver: yupResolver(ChangePasswordSchema)
  })

  const navigate = useNavigate()
  const [isConfirmSuccess, setIsConfirmSuccess] = useState<boolean>(false)
  const emailCurrentRef = useRef('')

  const sendCodeToEmailMutation = useMutation({
    mutationFn: (body: { emailRequest: string }) => sendCodeToEmailToChangePassword(body)
  })

  const changePasswordMutation = useMutation({
    mutationFn: (body: { email: string; newPassword: string }) => resetPassword(body)
  })

  const onSendCodeToEmail = sendEmailForm.handleSubmit((values: SendEmailFormData) => {
    const payload = {
      emailRequest: values.email
    }
    sendCodeToEmailMutation.mutate(payload, {
      onSuccess: () => {
        emailCurrentRef.current = payload.emailRequest
        navigate({
          pathname: path.forgotPassword,
          search: createSearchParams({
            status: forgotPasswordStatus.confirm
          }).toString()
        })
      }
    })
  })

  const onChangePassword = changePasswordForm.handleSubmit((values: ChangePasswordFormData) => {
    const payload = {
      email: emailCurrentRef.current,
      newPassword: values.newPassword
    }
    changePasswordMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        navigate(path.login)
      }
    })
  })

  useEffect(() => {
    if (isConfirmSuccess) {
      navigate({
        pathname: path.forgotPassword,
        search: createSearchParams({
          status: forgotPasswordStatus.changePassword
        }).toString()
      })
    }
  }, [isConfirmSuccess])

  console.log(changePasswordForm.watch())

  return (
    <div className='h-[100vh]'>
      <div className='grid grid-cols-12 h-full'>
        <div className='col-span-5 px-6 py-4'>
          <h1 className='font-bold text-xl mb-4 text-center'>Quên mật khẩu</h1>
          {status === forgotPasswordStatus.send && (
            <div>
              <Form {...sendEmailForm}>
                <form onSubmit={onSendCodeToEmail}>
                  <FormField
                    control={sendEmailForm.control}
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
                  <Button
                    isLoading={sendCodeToEmailMutation.isPending}
                    disabled={sendCodeToEmailMutation.isPending}
                    type='submit'
                    className='w-full mt-4'
                  >
                    Yêu cầu
                  </Button>
                </form>
              </Form>
            </div>
          )}
          {status === forgotPasswordStatus.confirm && (
            <ConfirmToken email={sendEmailForm.watch('email')} setIsConfirmSuccess={setIsConfirmSuccess} />
          )}
          {status === forgotPasswordStatus.changePassword && (
            <Form {...changePasswordForm}>
              <form onSubmit={onChangePassword}>
                <FormField
                  control={changePasswordForm.control}
                  name='currentPassword'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='Mật khẩu hiện tại' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={changePasswordForm.control}
                  name='newPassword'
                  render={({ field }) => (
                    <FormItem className='mb-4'>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='Mật khẩu mới' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={changePasswordForm.control}
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
                <Button
                  isLoading={changePasswordMutation.isPending}
                  disabled={changePasswordMutation.isPending}
                  type='submit'
                  className='w-full'
                >
                  Cập nhật
                </Button>
              </form>
            </Form>
          )}
        </div>
        <div className='col-span-7'>
          <img src={BackgroundImage} alt='bg' className='w-full h-full bg-center' />
        </div>
      </div>
    </div>
  )
}
