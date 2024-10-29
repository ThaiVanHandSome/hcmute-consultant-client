import { changeEmail } from '@/apis/auth.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { ErrorResponse } from '@/types/utils.type'
import { ChangeEmailSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly email: string
  readonly isDisabledTriggerButton: boolean
}

type ChangeEmailFormData = yup.InferType<typeof ChangeEmailSchema>

export default function ChangeEmailDialog({ email, isDisabledTriggerButton }: Props) {
  const changeEmailForm = useForm<ChangeEmailFormData>({
    defaultValues: {
      newEmail: ''
    },
    resolver: yupResolver(ChangeEmailSchema)
  })

  const changeEmailMutation = useMutation({
    mutationFn: (body: { oldEmail: string; newEmail: string }) => changeEmail(body)
  })

  const onChangeEmailSubmit = changeEmailForm.handleSubmit((values: ChangeEmailFormData) => {
    const payload = {
      oldEmail: email,
      newEmail: values.newEmail
    }
    changeEmailMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<{ field: string; message: string }[]>>(error)) {
          const formError = error.response?.data.data

          // loop each field and render error message of it
          formError?.forEach(({ field, message }) => {
            changeEmailForm.setError(field as keyof ChangeEmailFormData, {
              message: message,
              type: 'server'
            })
          })
        }
      }
    })
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isDisabledTriggerButton} type='button' variant='outline' className='w-full mb-4'>
          Gửi mã xác nhận lần nữa với email mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thay đổi email</DialogTitle>
          <Form {...changeEmailForm}>
            <form onSubmit={onChangeEmailSubmit}>
              <InputCustom control={changeEmailForm.control} name='newEmail' label='Email' placeholder='Email' />
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
  )
}
