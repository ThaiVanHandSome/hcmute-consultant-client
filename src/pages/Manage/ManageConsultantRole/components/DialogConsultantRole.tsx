import { createAdminConsultantRole } from '@/apis/role.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useConsultantQueryConfig from '@/hooks/useConsultantQueryConfig'
import { ConsultantRoleType } from '@/types/role.type'
import { ConsultantRoleSchema } from '@/utils/rules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly role?: ConsultantRoleType
}

type FormData = yup.InferType<typeof ConsultantRoleSchema>

export default function DialogConsultantRole({ children, role }: Props) {
  const isUpdate = !!role

  const queryClient = useQueryClient()
  const consultantRoleQueryConfig = useConsultantQueryConfig()
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<FormData>({
    defaultValues: {
      name: role?.name ?? '',
      // eslint-disable-next-line no-constant-binary-expression
      roleId: String(role?.roleId) ?? ''
    }
  })

  const createConsultantRoleMutation = useMutation({
    mutationFn: ({ roleId, name }: { roleId: string; name: string }) => createAdminConsultantRole(roleId, name)
  })

  // const updateRoleMutation = useMutation({
  //   mutationFn: ({ id, name }: { id: number; name: string }) => updateAdminRole(id, name)
  // })

  const onSubmit = form.handleSubmit((values) => {
    if (isUpdate) {
      // const id = role.id
      // updateRoleMutation.mutate(
      //   { id, name },
      //   {
      //     onSuccess: (res) => {
      //       toast({
      //         variant: 'success',
      //         description: res.data.message
      //       })
      //       setOpen(false)
      //       queryClient.invalidateQueries({
      //         queryKey: ['admin-roles', roleQueryConfig]
      //       })
      //     }
      //   }
      // )
      return
    }
    createConsultantRoleMutation.mutate(
      {
        ...values
      },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          setOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['admin-consultant-roles', consultantRoleQueryConfig]
          })
        }
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Chỉnh sửa quyền tư vấn viên' : 'Thêm quyền tư vấn viên'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='name' placeholder='Tên quyền' label='Tên' />
              <InputCustom control={form.control} name='roleId' placeholder='Mã quyền' label='Mã quyền' />
              <Button
                disabled={createConsultantRoleMutation.isPending}
                isLoading={createConsultantRoleMutation.isPending}
              >
                {isUpdate ? 'Lưu' : 'Thêm'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
