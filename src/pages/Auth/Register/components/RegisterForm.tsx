import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'

import { register } from '@/apis/auth.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import RadioGroupCustom from '@/components/dev/Form/RadioGroupCustom'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import registerStatus from '@/constants/registerStatus'
import { ErrorResponse, FormControlItem } from '@/types/utils.type'
import { RegisterSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { Button } from '@/components/ui/button'

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

interface Props {
  readonly setEmail: React.Dispatch<React.SetStateAction<string>>
}

export type RegisterFormData = yup.InferType<typeof RegisterSchema>

export default function RegisterForm({ setEmail }: Props) {
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

  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: (body: RegisterFormData) => register(body)
  })
  // handle register process
  const onSubmit = (values: RegisterFormData) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        setEmail(form.getValues('email'))
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputCustom control={form.control} name='username' placeholder='Username' label='Tên tài khoản' />
        <InputCustom control={form.control} name='email' placeholder='Email' label='Email' />
        <InputCustom type='password' control={form.control} name='password' placeholder='Mật khẩu' label='Mật khẩu' />
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
  )
}
