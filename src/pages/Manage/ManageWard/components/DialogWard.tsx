import { addWardAdmin, updateWardAdmin } from '@/apis/address.api'
import { getDistricts, getProvinces } from '@/apis/location.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useWardQueryConfig from '@/hooks/useWardQueryConfig'
import { WardType } from '@/types/location.type'
import { WardSchema } from '@/utils/rules'
import { generateSelectionDataFromLocation } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly ward?: WardType
}

type FormData = yup.InferType<typeof WardSchema>

export default function DialogWard({ children, ward }: Props) {
  const isUpdate = !!ward
  const queryClient = useQueryClient()
  const wardQueryConfig = useWardQueryConfig()
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<FormData>({
    defaultValues: {
      code: ward?.code ?? '',
      codeName: ward?.codeName ?? '',
      fullName: ward?.fullName ?? '',
      fullNameEn: ward?.fullNameEn ?? '',
      name: ward?.name ?? '',
      nameEn: ward?.nameEn ?? '',
      districtCode: ward?.districtCode ?? '',
      provinceCode: '01'
    },
    resolver: yupResolver(WardSchema)
  })

  const createWardMutation = useMutation({
    mutationFn: (ward: WardType) => addWardAdmin(ward)
  })

  const updateWardMutation = useMutation({
    mutationFn: (ward: WardType) => updateWardAdmin(ward)
  })

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces
  })

  const provincesSelectionData = useMemo(() => {
    const data = provinces?.data.data
    return generateSelectionDataFromLocation(data)
  }, [provinces])

  const provinceCode = form.watch('provinceCode')
  const { data: districts } = useQuery({
    queryKey: ['districts', provinceCode],
    queryFn: () => getDistricts(provinceCode as string),
    enabled: !!provinceCode
  })

  const districtsSelectionData = useMemo(() => {
    const data = districts?.data.data
    return generateSelectionDataFromLocation(data)
  }, [districts])

  const onSubmit = form.handleSubmit((values) => {
    if (!isUpdate) {
      createWardMutation.mutate(values, {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          queryClient.invalidateQueries({
            queryKey: ['admin-wards', wardQueryConfig]
          })
          setOpen(false)
        }
      })
      return
    }
    updateWardMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        queryClient.invalidateQueries({
          queryKey: ['admin-wards', wardQueryConfig]
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
          <DialogTitle>{isUpdate ? 'Chỉnh sửa Phường/Xã' : 'Thêm Phường/Xã'}</DialogTitle>
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
              <SelectionCustom
                control={form.control}
                name='provinceCode'
                data={provincesSelectionData}
                placeholder='Tỉnh/Thành phố'
                label='Tỉnh/Thành phố'
              />
              <SelectionCustom
                control={form.control}
                name='districtCode'
                data={districtsSelectionData}
                placeholder='Phường/Xã'
                label='Phường/Xã'
              />
              <Button
                className='w-full mt-2'
                isLoading={createWardMutation.isPending || updateWardMutation.isPending}
                disabled={createWardMutation.isPending || updateWardMutation.isPending}
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
