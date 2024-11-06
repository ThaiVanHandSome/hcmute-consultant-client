import { addProvinceAdmin, updateProvinceAdmin } from '@/apis/address.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useProvinceQueryConfig from '@/hooks/useProvinceQueryConfig'
import { ProvinceType } from '@/types/location.type'
import { ProvinceSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly province?: ProvinceType
}

type FormData = yup.InferType<typeof ProvinceSchema>

export default function DialogProvince({ children, province }: Props) {
  const isUpdate = !!province
  const queryClient = useQueryClient()
  const provinceQueryConfig = useProvinceQueryConfig()
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<FormData>({
    defaultValues: {
      code: province?.code ?? '',
      codeName: province?.codeName ?? '',
      fullName: province?.fullName ?? '',
      fullNameEn: province?.fullNameEn ?? '',
      name: province?.name ?? '',
      nameEn: province?.nameEn ?? ''
    },
    resolver: yupResolver(ProvinceSchema)
  })

  const createProvinceMutation = useMutation({
    mutationFn: (province: ProvinceType) => addProvinceAdmin(province)
  })

  const updateProvinceMutation = useMutation({
    mutationFn: (province: ProvinceType) => updateProvinceAdmin(province)
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!isUpdate) {
      createProvinceMutation.mutate(values, {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          queryClient.invalidateQueries({
            queryKey: ['admin-provinces', provinceQueryConfig]
          })
          setOpen(false)
        }
      })
      return
    }
    updateProvinceMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        queryClient.invalidateQueries({
          queryKey: ['admin-provinces', provinceQueryConfig]
        })
        setOpen(false)
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='overflow-y-auto max-h-[95vh]'>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Chỉnh sửa Tỉnh/Thành phố' : 'Thêm Tỉnh/Thành phố'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='code' placeholder='Nhập mã' label='Mã' />
              <InputCustom control={form.control} name='codeName' placeholder='Nhập tên mã' label='Tên mã' />
              <InputCustom control={form.control} name='fullName' placeholder='Nhập toàn bộ tên' label='Toàn bộ tên' />
              <InputCustom
                control={form.control}
                name='fullNameEn'
                placeholder='Nhập toàn bộ tên (English)'
                label='Toàn bộ tên (English)'
              />
              <InputCustom control={form.control} name='name' placeholder='Nhập tên' label='Tên' />
              <InputCustom
                control={form.control}
                name='nameEn'
                placeholder='Nhập tên (English)'
                label='Tên (English)'
              />

              <Button
                className='w-full mt-2'
                isLoading={createProvinceMutation.isPending || updateProvinceMutation.isPending}
                disabled={createProvinceMutation.isPending || updateProvinceMutation.isPending}
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
