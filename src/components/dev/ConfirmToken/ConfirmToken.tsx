import { changeEmail, confirmRegistration, resendRegisterVerificationCode } from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ChangeEmailSchema, ConfirmTokenSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'

type FormData = yup.InferType<typeof ConfirmTokenSchema>
type ChangeEmailFormData = yup.InferType<typeof ChangeEmailSchema>

interface Props {
  readonly email: string
  readonly setIsConfirmSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConfirmToken({ email, setIsConfirmSuccess }: Props) {
  const form = useForm<FormData>({
    defaultValues: {
      token: ''
    },
    resolver: yupResolver(ConfirmTokenSchema)
  })

  const changeEmailForm = useForm<ChangeEmailFormData>({
    defaultValues: {
      newEmail: ''
    },
    resolver: yupResolver(ChangeEmailSchema)
  })

  const confirmRegistrationMutation = useMutation({
    mutationFn: (body: { emailRequest: string; token: string }) => confirmRegistration(body)
  })

  const resendRegisterVerificationCodeMutation = useMutation({
    mutationFn: (body: { emailRequest: string }) => resendRegisterVerificationCode(body)
  })

  const changeEmailMutation = useMutation({
    mutationFn: (body: { oldEmail: string; newEmail: string }) => changeEmail(body)
  })

  const handleResendWithPreviousEmail = () => {
    const payload = {
      emailRequest: email
    }
    resendRegisterVerificationCodeMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.data.message)
      }
    })
  }

  const onSubmit = form.handleSubmit((values: FormData) => {
    const payload = {
      emailRequest: email,
      token: values.token
    }
    confirmRegistrationMutation.mutate(payload, {
      onSuccess: () => {
        setIsConfirmSuccess(true)
      }
    })
  })

  const checkDisabledButton = () => {
    if (resendRegisterVerificationCodeMutation.isPending || confirmRegistrationMutation.isPending) return true
    return false
  }

  const onChangeEmailSubmit = changeEmailForm.handleSubmit((values: ChangeEmailFormData) => {
    const payload = {
      oldEmail: email,
      newEmail: values.newEmail
    }
    changeEmailMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.data.message)
      }
    })
  })

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name='token'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã xác nhận</FormLabel>
                <FormControl>
                  <Input placeholder='Mã xác nhận' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            isLoading={confirmRegistrationMutation.isPending}
            disabled={checkDisabledButton()}
            type='submit'
            className='w-full mt-6'
          >
            Xác nhận
          </Button>
        </form>
        <div className='my-4 h-[1px] w-full bg-gray-400' />
        <Button
          isLoading={resendRegisterVerificationCodeMutation.isPending}
          disabled={checkDisabledButton()}
          type='button'
          variant='outline'
          className='w-full mb-4'
          onClick={handleResendWithPreviousEmail}
        >
          Gửi mã xác nhận lần nữa
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={checkDisabledButton()} type='button' variant='outline' className='w-full mb-4'>
              Gửi mã xác nhận lần nữa với email mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thay đổi email</DialogTitle>
              <Form {...changeEmailForm}>
                <form onSubmit={onChangeEmailSubmit}>
                  <FormField
                    control={changeEmailForm.control}
                    name='newEmail'
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
                    isLoading={changeEmailMutation.isPending}
                    disabled={changeEmailMutation.isPending}
                    type='submit'
                    className='mt-4 w-full'
                  >
                    Gửi
                  </Button>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </Form>
    </div>
  )
}
