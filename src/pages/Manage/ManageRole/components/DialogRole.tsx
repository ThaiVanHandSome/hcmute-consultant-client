import { createAdminRole, updateAdminRole } from '@/apis/role.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useRoleQueryConfig from '@/hooks/useRoleQueryConfig'
import { RoleType } from '@/types/role.type'
import { RoleSchema } from '@/utils/rules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly role?: RoleType
}

type FormData = yup.InferType<typeof RoleSchema>

export default function DialogRole({ children, role }: Props) {
  const isUpdate = !!role

  const queryClient = useQueryClient()
  const roleQueryConfig = useRoleQueryConfig()
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<FormData>({
    defaultValues: {
      name: role?.name ?? ''
    }
  })

  const createRoleMutation = useMutation({
    mutationFn: (name: string) => createAdminRole(name)
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateAdminRole(id, name)
  })

  const onSubmit = form.handleSubmit((values) => {
    const name = values.name
    if (isUpdate) {
      const id = role.id
      updateRoleMutation.mutate(
        { id, name },
        {
          onSuccess: (res) => {
            toast({
              variant: 'success',
              description: res.data.message
            })
            setOpen(false)
            queryClient.invalidateQueries({
              queryKey: ['admin-roles', roleQueryConfig]
            })
          }
        }
      )
      return
    }
    createRoleMutation.mutate(name, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['admin-roles', roleQueryConfig]
        })
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Chỉnh sửa quyền' : 'Thêm quyền'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='name' placeholder='Tên quyền' label='Tên' />
              <Button
                disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
                isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
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
