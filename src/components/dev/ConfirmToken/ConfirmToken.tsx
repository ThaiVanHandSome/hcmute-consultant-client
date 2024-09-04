import { confirmRegistration } from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ConfirmTokenSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = yup.InferType<typeof ConfirmTokenSchema>

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

  const confirmRegistrationMutation = useMutation({
    mutationFn: (body: { emailRequest: string; token: string }) => confirmRegistration(body)
  })

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
            disabled={confirmRegistrationMutation.isPending}
            type='submit'
            className='w-full mt-6'
          >
            Xác nhận
          </Button>
        </form>
      </Form>
    </div>
  )
}
