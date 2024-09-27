import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'

import { sendCodeToEmailToChangePassword } from '@/apis/auth.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import forgotPasswordStatus from '@/constants/forgotPasswordStatus'
import path from '@/constants/path'
import { ErrorResponse } from '@/types/utils.type'
import { PasswordRecoverySchema } from '@/utils/rules'
import { isAxiosUnprocessableEntity } from '@/utils/utils'

interface Props {
  readonly setEmail: React.Dispatch<React.SetStateAction<string>>
}

type SendEmailFormData = Pick<yup.InferType<typeof PasswordRecoverySchema>, 'emailRequest'>
const SendEmailSchema = PasswordRecoverySchema.pick(['emailRequest'])

export default function EmailForm({ setEmail }: Props) {
  const sendEmailForm = useForm<SendEmailFormData>({
    defaultValues: {
      emailRequest: ''
    },
    resolver: yupResolver(SendEmailSchema)
  })

  const navigate = useNavigate()

  const sendCodeToEmailMutation = useMutation({
    mutationFn: (body: { emailRequest: string }) => sendCodeToEmailToChangePassword(body)
  })

  // handle send token process to email to verify account
  const onSendCodeToEmail = sendEmailForm.handleSubmit((values: SendEmailFormData) => {
    const payload = {
      emailRequest: values.emailRequest
    }
    sendCodeToEmailMutation.mutate(payload, {
      onSuccess: () => {
        setEmail(payload.emailRequest)
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

  return (
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
  )
}
