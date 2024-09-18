import { updatePassword } from '@/apis/auth.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { ErrorResponse } from '@/types/utils.type'
import { PasswordRecoverySchema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = Omit<yup.InferType<typeof PasswordRecoverySchema>, 'emailRequest'>
const Schema = PasswordRecoverySchema.omit(['emailRequest'])

export default function ChangePassword() {
  const form = useForm<FormData>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    },
    resolver: yupResolver(Schema)
  })

  const updatePasswordMutation = useMutation({
    mutationFn: (body: { password: string; newPassword: string }) => updatePassword(body)
  })

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      password: values.password,
      newPassword: values.newPassword
    }
    updatePasswordMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          title: 'Thành công',
          description: res.data.message
        })
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
    <div>
      <h1 className='font-bold mb-4 text-primary'>Thay đổi mật khẩu</h1>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom
              type='password'
              control={form.control}
              name='password'
              label='Mật khẩu hiện tại'
              placeholder='Mật khẩu hiện tại'
            />
            <InputCustom
              type='password'
              control={form.control}
              name='newPassword'
              label='Mật khẩu mới'
              placeholder='Mật khẩu mới'
            />
            <InputCustom
              type='password'
              control={form.control}
              name='confirmPassword'
              label='Nhập lại mật khẩu'
              placeholder='Nhập lại mật khẩu'
            />
            <Button
              isLoading={updatePasswordMutation.isPending}
              disabled={updatePasswordMutation.isPending}
              type='submit'
              className='px-6 py-2'
            >
              Cập nhật
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
