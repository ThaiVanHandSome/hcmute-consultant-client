import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMatch } from 'react-router-dom'
import * as yup from 'yup'

import { confirmRegistration, resendRegisterVerificationCode, verifyCodeWhenForgotPassword } from '@/apis/auth.api'
import ChangeEmailDialog from '@/components/dev/ConfirmToken/components/ChangeEmailDialog'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { ConfirmTokenSchema } from '@/utils/rules'
import { Separator } from '@/components/ui/separator'
import ResendButton from '@/components/dev/ConfirmToken/components/ResendButton'

type FormData = yup.InferType<typeof ConfirmTokenSchema>

interface Props {
  readonly email: string
  readonly setIsConfirmSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConfirmToken({ email, setIsConfirmSuccess }: Props) {
  const match = useMatch(path.register)
  const isRegisterPage = Boolean(match)

  const form = useForm<FormData>({
    defaultValues: {
      token: ''
    },
    resolver: yupResolver(ConfirmTokenSchema)
  })

  const confirmRegistrationMutation = useMutation({
    mutationFn: (body: { emailRequest: string; token: string }) => confirmRegistration(body)
  })

  const verifyCodeWhenForgotPasswordMutation = useMutation({
    mutationFn: (body: { emailRequest: string; code: string }) => verifyCodeWhenForgotPassword(body)
  })

  const resendRegisterVerificationCodeMutation = useMutation({
    mutationFn: (body: { emailRequest: string }) => resendRegisterVerificationCode(body)
  })

  const handleResendWithPreviousEmail = () => {
    const payload = {
      emailRequest: email
    }
    resendRegisterVerificationCodeMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
      }
    })
  }

  const onSubmit = form.handleSubmit((values: FormData) => {
    if (isRegisterPage) {
      const payload = {
        emailRequest: email,
        token: values.token
      }
      confirmRegistrationMutation.mutate(payload, {
        onSuccess: () => {
          setIsConfirmSuccess(true)
        }
      })
    } else {
      const payload = {
        emailRequest: email,
        code: values.token
      }
      verifyCodeWhenForgotPasswordMutation.mutate(payload, {
        onSuccess: () => {
          setIsConfirmSuccess(true)
        }
      })
    }
  })

  const isSubmitting = confirmRegistrationMutation.isPending || resendRegisterVerificationCodeMutation.isPending

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <InputCustom control={form.control} name='token' label='Mã xác nhận' placeholder='Mã xác nhận' />
          <Button
            isLoading={confirmRegistrationMutation.isPending}
            disabled={isSubmitting}
            type='submit'
            className='w-full mt-6'
          >
            Xác nhận
          </Button>
        </form>
        {isRegisterPage && (
          <>
            <Separator className='my-4' />
            <ResendButton
              isLoading={resendRegisterVerificationCodeMutation.isPending}
              disabled={isSubmitting}
              onClick={handleResendWithPreviousEmail}
            />
            <ChangeEmailDialog email={email} isDisabledTriggerButton={isSubmitting} />
          </>
        )}
      </Form>
    </div>
  )
}
