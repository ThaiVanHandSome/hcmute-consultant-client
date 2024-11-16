import { getDistrictAdmin } from '@/apis/address.api'
import { getProvinces } from '@/apis/location.api'
import ExportCustom from '@/components/dev/ExportCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import Paginate from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useDistrictQueryConfig from '@/hooks/useDistrictQueryConfig'
import DialogDistrict from '@/pages/Manage/ManageDistrict/components/DialogDistrict'
import DistrictTable from '@/pages/Manage/ManageDistrict/components/DistrictTable'
import { generateSelectionDataFromLocation } from '@/utils/utils'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageDistrict() {
  const districtQueryConfig = useDistrictQueryConfig()
  const form = useForm({
    defaultValues: {
      provinceCode: districtQueryConfig.provinceCode ?? '01'
    }
  })

  const navigate = useNavigate()

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces
  })

  const { data: districts } = useQuery({
    queryKey: ['admin-districts', districtQueryConfig],
    queryFn: () => getDistrictAdmin(districtQueryConfig)
  })

  const provincesSelectionData = useMemo(() => {
    const data = provinces?.data.data
    return generateSelectionDataFromLocation(data)
  }, [provinces])

  const provinceCode = form.watch('provinceCode')
  useEffect(() => {
    navigate({
      pathname: path.manageDistrict,
      search: createSearchParams({
        ...districtQueryConfig,
        provinceCode
      }).toString()
    })
  }, [provinceCode])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Quận/Huyện</h1>
          <p className='text-sm italic'>Quản lý Quận/Huyện</p>
        </div>
        <div className='flex items-center space-x-2'>
          <DialogDistrict>
            <Button>
              <PlusIcon />
              <span>Thêm Quận/Huyện</span>
            </Button>
          </DialogDistrict>
          <ExportCustom dataType='district' queryConfig={districtQueryConfig} />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form>
            <div className='grid grid-cols-3'>
              <div className='col-span-1'>
                <SelectionCustom
                  control={form.control}
                  name='provinceCode'
                  data={provincesSelectionData}
                  placeholder='Tỉnh/Thành phố'
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div>
        <DistrictTable districts={districts?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageDistrict}
          queryConfig={districtQueryConfig}
          pageSize={districts?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
