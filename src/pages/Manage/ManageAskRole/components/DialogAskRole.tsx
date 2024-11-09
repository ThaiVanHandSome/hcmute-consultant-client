import { createAdminAskRole, updateAdminAskRole } from '@/apis/role.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useConsultantQueryConfig from '@/hooks/useConsultantQueryConfig'
import { ConsultantRoleType } from '@/types/role.type'
import { ConsultantRoleSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly role?: ConsultantRoleType
}

type FormData = yup.InferType<typeof ConsultantRoleSchema>

export default function DialogAskRole({ children, role }: Props) {
  const isUpdate = !!role

  const queryClient = useQueryClient()
  const askRoleQueryConfig = useConsultantQueryConfig()
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<FormData>({
    defaultValues: {
      name: role?.name ?? '',
      roleId: String(role?.roleId ?? '')
    },
    resolver: yupResolver(ConsultantRoleSchema)
  })

  const createAskRoleMutation = useMutation({
    mutationFn: ({ roleId, name }: { roleId: string; name: string }) => createAdminAskRole(roleId, name)
  })

  const updateAskRoleMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateAdminAskRole(id, name)
  })

  const onSubmit = form.handleSubmit((values) => {
    const name = values.name
    if (isUpdate) {
      const id = role.id
      updateAskRoleMutation.mutate(
        { id, name },
        {
          onSuccess: (res) => {
            toast({
              variant: 'success',
              description: res.data.message
            })
            setOpen(false)
            queryClient.invalidateQueries({
              queryKey: ['admin-ask-roles', askRoleQueryConfig]
            })
          }
        }
      )
      return
    }
    createAskRoleMutation.mutate(
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
            queryKey: ['admin-ask-roles', askRoleQueryConfig]
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
          <DialogTitle>{isUpdate ? 'Chỉnh sửa quyền người hỏi' : 'Thêm quyền người hỏi'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='name' placeholder='Tên quyền' label='Tên' />
              <InputCustom control={form.control} name='roleId' placeholder='Mã quyền' label='Mã quyền' />
              <Button
                disabled={createAskRoleMutation.isPending || updateAskRoleMutation.isPending}
                isLoading={createAskRoleMutation.isPending || updateAskRoleMutation.isPending}
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
