import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { resetPassword } from '@/apis/auth.api'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { ErrorResponse } from '@/types/utils.type'
import { PasswordRecoverySchema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'

interface Props {
  readonly email: string
}

type ChangePasswordFormData = Omit<yup.InferType<typeof PasswordRecoverySchema>, 'emailRequest'>
const ChangePasswordSchema = PasswordRecoverySchema.omit(['emailRequest'])

export default function ChangePasswordWhenForgot({ email }: Props) {
  const changePasswordForm = useForm<ChangePasswordFormData>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    },
    resolver: yupResolver(ChangePasswordSchema)
  })

  const navigate = useNavigate()

  const changePasswordMutation = useMutation({
    mutationFn: (body: { email: string; newPassword: string }) => resetPassword(body)
  })

  // handle change password process
  const onChangePassword = changePasswordForm.handleSubmit((values: ChangePasswordFormData) => {
    const payload = {
      email,
      newPassword: values.newPassword
    }
    changePasswordMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
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

  return (
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
  )
}
