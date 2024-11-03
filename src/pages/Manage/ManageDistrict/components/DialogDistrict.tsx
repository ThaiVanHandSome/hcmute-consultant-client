import { addDistrictAdmin, updateDistrictAdmin } from '@/apis/address.api'
import { getProvinces } from '@/apis/location.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useDistrictQueryConfig from '@/hooks/useDistrictQueryConfig'
import { DistrictType } from '@/types/location.type'
import { DistrictSchema } from '@/utils/rules'
import { generateSelectionDataFromLocation } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly district?: DistrictType
}

type FormData = yup.InferType<typeof DistrictSchema>

export default function DialogDistrict({ children, district }: Props) {
  const isUpdate = !!district
  const queryClient = useQueryClient()
  const districtQueryConfig = useDistrictQueryConfig()
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm<FormData>({
    defaultValues: {
      code: district?.code ?? '',
      codeName: district?.codeName ?? '',
      fullName: district?.fullName ?? '',
      fullNameEn: district?.fullNameEn ?? '',
      name: district?.name ?? '',
      nameEn: district?.nameEn ?? '',
      provinceCode: district?.provinceCode ?? ''
    },
    resolver: yupResolver(DistrictSchema)
  })

  const createDistrictMutation = useMutation({
    mutationFn: (district: DistrictType) => addDistrictAdmin(district)
  })

  const updateDistrictMutation = useMutation({
    mutationFn: (district: DistrictType) => updateDistrictAdmin(district)
  })

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces
  })

  const provincesSelectionData = useMemo(() => {
    const data = provinces?.data.data
    return generateSelectionDataFromLocation(data)
  }, [provinces])

  const onSubmit = form.handleSubmit((values) => {
    if (!isUpdate) {
      createDistrictMutation.mutate(values, {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          queryClient.invalidateQueries({
            queryKey: ['admin-districts', districtQueryConfig]
          })
          setOpen(false)
        }
      })
      return
    }
    updateDistrictMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        queryClient.invalidateQueries({
          queryKey: ['admin-districts', districtQueryConfig]
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
          <DialogTitle>{isUpdate ? 'Chỉnh sửa Quận/Huyện' : 'Thêm Quận/Huyện'}</DialogTitle>
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
              <Button
                className='w-full mt-2'
                isLoading={createDistrictMutation.isPending || updateDistrictMutation.isPending}
                disabled={createDistrictMutation.isPending || updateDistrictMutation.isPending}
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
