import { getWardAdmin } from '@/apis/address.api'
import { getDistricts, getProvinces } from '@/apis/location.api'
import ExportCustom from '@/components/dev/ExportCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import Paginate from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useWardQueryConfig from '@/hooks/useWardQueryConfig'
import DialogAddDistrict from '@/pages/Manage/ManageDistrict/components/DialogDistrict'
import DialogWard from '@/pages/Manage/ManageWard/components/DialogWard'
import WardTable from '@/pages/Manage/ManageWard/components/WardTable'
import { generateSelectionDataFromLocation } from '@/utils/utils'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageWard() {
  const wardQueryConfig = useWardQueryConfig()
  const form = useForm({
    defaultValues: {
      provinceCode: '01',
      districtCode: wardQueryConfig.districtCode ?? '01'
    }
  })

  const navigate = useNavigate()

  const { data: wards } = useQuery({
    queryKey: ['admin-wards', wardQueryConfig],
    queryFn: () => getWardAdmin(wardQueryConfig)
  })
  console.log(wards)

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
    queryFn: () => getDistricts(provinceCode),
    enabled: !!provinceCode
  })

  const districtsSelectionData = useMemo(() => {
    const data = districts?.data.data
    return generateSelectionDataFromLocation(data)
  }, [districts])

  const districtCode = form.watch('districtCode')
  useEffect(() => {
    navigate({
      pathname: path.manageWard,
      search: createSearchParams({
        ...wardQueryConfig,
        districtCode
      }).toString()
    })
  }, [provinceCode, districtCode])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Phường/Xã</h1>
          <p className='text-sm italic'>Quản lý Phường/Xã</p>
        </div>
        <div className='flex items-center space-x-2'>
          <DialogWard>
            <Button>
              <PlusIcon />
              <span>Thêm Phường/Xã</span>
            </Button>
          </DialogWard>
          <ExportCustom dataType='ward' queryConfig={wardQueryConfig} />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form>
            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-1'>
                <SelectionCustom
                  control={form.control}
                  name='provinceCode'
                  data={provincesSelectionData}
                  placeholder='Tỉnh/Thành phố'
                  label='Tỉnh/Thành phố'
                />
              </div>
              <div className='col-span-1'>
                <SelectionCustom
                  control={form.control}
                  name='districtCode'
                  data={districtsSelectionData}
                  placeholder='Phường/Xã'
                  label='Phường/Xã'
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div>
        <WardTable wards={wards?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageWard}
          queryConfig={wardQueryConfig}
          pageSize={wards?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
