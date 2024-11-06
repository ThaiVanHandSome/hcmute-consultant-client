import { deleteProvinceAdmin } from '@/apis/address.api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import useProvinceQueryConfig from '@/hooks/useProvinceQueryConfig'
import { ProvinceType } from '@/types/location.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

interface Props {
  readonly children: React.ReactNode
  readonly province: ProvinceType
}
export default function DialogDeleteProvince({ children, province }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const provinceQueryConfig = useProvinceQueryConfig()

  const deleteProvinceMutation = useMutation({
    mutationFn: (code: string) => deleteProvinceAdmin(code)
  })

  const handleDelete = () => {
    const code = province.code
    deleteProvinceMutation.mutate(code, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['admin-provinces', provinceQueryConfig]
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
          <p>Bạn chắc chắn muốn Tỉnh/Thành phố này?</p>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              isLoading={deleteProvinceMutation.isPending}
              disabled={deleteProvinceMutation.isPending}
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
