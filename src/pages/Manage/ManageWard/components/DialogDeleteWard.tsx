import { deleteWardAdmin } from '@/apis/address.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import useWardQueryConfig from '@/hooks/useWardQueryConfig'
import { WardType } from '@/types/location.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly ward: WardType
}
export default function DialogDeleteWard({ children, ward }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const wardQueryConfig = useWardQueryConfig()

  const deleteWardMutation = useMutation({
    mutationFn: (code: string) => deleteWardAdmin(code)
  })

  const handleDelete = () => {
    const code = ward.code
    deleteWardMutation.mutate(code, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['admin-wards', wardQueryConfig]
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
          <p>Bạn chắc chắn muốn Phường/Xã này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              isLoading={deleteWardMutation.isPending}
              disabled={deleteWardMutation.isPending}
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
