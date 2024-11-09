import { deleteAdminAskRole } from '@/apis/role.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import useConsultantRoleQueryConfig from '@/hooks/useConsultantRoleQueryConfig'
import { ConsultantRoleType } from '@/types/role.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly role: ConsultantRoleType
}

export default function DialogDeleteAskRole({ children, role }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const askRoleQueryConfig = useConsultantRoleQueryConfig()

  const deleteAskRoleMutation = useMutation({
    mutationFn: (id: number) => deleteAdminAskRole(id)
  })

  const handleDelete = () => {
    const id = role.id
    deleteAskRoleMutation.mutate(id, {
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
              isLoading={deleteAskRoleMutation.isPending}
              disabled={deleteAskRoleMutation.isPending}
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
