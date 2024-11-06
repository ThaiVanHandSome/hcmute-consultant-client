import { deleteAdminRole } from '@/apis/role.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import useRoleQueryConfig from '@/hooks/useRoleQueryConfig'
import { RoleType } from '@/types/role.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly role: RoleType
}

export default function DialogDeleteRole({ children, role }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const roleQueryConfig = useRoleQueryConfig()

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => deleteAdminRole(id)
  })

  const handleDelete = () => {
    const id = role.id
    deleteRoleMutation.mutate(id, {
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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>Bạn chắc chắn muốn quyền này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              isLoading={deleteRoleMutation.isPending}
              disabled={deleteRoleMutation.isPending}
              variant='destructive'
              onClick={handleDelete}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
