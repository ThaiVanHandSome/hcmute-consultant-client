import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { PasswordRecoverySchema } from '@/utils/rules'
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
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import InputCustom from '@/components/dev/Form/InputCustom'
import { toast } from '@/hooks/use-toast'

type SendEmailFormData = Pick<yup.InferType<typeof PasswordRecoverySchema>, 'emailRequest'>
const SendEmailSchema = PasswordRecoverySchema.pick(['emailRequest'])

type ChangePasswordFormData = Omit<yup.InferType<typeof PasswordRecoverySchema>, 'emailRequest'>
const ChangePasswordSchema = PasswordRecoverySchema.omit(['emailRequest'])

export default function ForgotPassword() {
  const { status } = useQueryParams()
  const sendEmailForm = useForm<SendEmailFormData>({
    defaultValues: {
      emailRequest: ''
    },
    resolver: yupResolver(SendEmailSchema)
  })

  const changePasswordForm = useForm<ChangePasswordFormData>({
    defaultValues: {
      password: '',
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
      emailRequest: values.emailRequest
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
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<{ field: string; message: string }[]>>(error)) {
          const formError = error.response?.data.data
          formError?.forEach(({ field, message }) => {
            sendEmailForm.setError(field as keyof SendEmailFormData, {
              message: message,
              type: 'server'
            })
          })
        }
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
        toast({
          variant: 'success',
          title: 'Thành công',
          description: res.data.message
        })
        navigate(path.login)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<{ field: string; message: string }[]>>(error)) {
          const formError = error.response?.data.data
          formError?.forEach(({ field, message }) => {
            changePasswordForm.setError(field as keyof ChangePasswordFormData, {
              message: message,
              type: 'server'
            })
          })
        }
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

  return (
    <div className='h-[100vh]'>
      <div className='grid grid-cols-12 h-full'>
        <div className='col-span-5 px-6 py-4'>
          <h1 className='font-bold text-xl mb-4 text-center'>Quên mật khẩu</h1>
          {status === forgotPasswordStatus.send && (
            <div>
              <Form {...sendEmailForm}>
                <form onSubmit={onSendCodeToEmail}>
                  <InputCustom control={sendEmailForm.control} name='emailRequest' label='Email' placeholder='Email' />
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
            <ConfirmToken email={sendEmailForm.watch('emailRequest')} setIsConfirmSuccess={setIsConfirmSuccess} />
          )}
          {status === forgotPasswordStatus.changePassword && (
            <Form {...changePasswordForm}>
              <form onSubmit={onChangePassword}>
                <InputCustom
                  type='password'
                  control={changePasswordForm.control}
                  name='password'
                  label='Mật khẩu hiện tại'
                  placeholder='Mật khẩu hiện tại'
                />
                <InputCustom
                  type='password'
                  control={changePasswordForm.control}
                  name='newPassword'
                  label='Mật khẩu mới'
                  placeholder='Mật khẩu mới'
                />
                <InputCustom
                  type='password'
                  control={changePasswordForm.control}
                  name='confirmPassword'
                  label='Nhập lại mật khẩu'
                  placeholder='Nhập lại mật khẩu'
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
