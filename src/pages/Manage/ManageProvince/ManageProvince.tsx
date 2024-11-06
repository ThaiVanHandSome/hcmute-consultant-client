import { getProvinceAdmin } from '@/apis/address.api'
import Paginate from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useProvinceQueryConfig from '@/hooks/useProvinceQueryConfig'
import DialogProvince from '@/pages/Manage/ManageProvince/components/DialogProvince'
import ProvinceTable from '@/pages/Manage/ManageProvince/components/ProvinceTable'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'

export default function ManageProvince() {
  const provinceQueryConfig = useProvinceQueryConfig()

  const { data: provinces } = useQuery({
    queryKey: ['admin-provinces', provinceQueryConfig],
    queryFn: () => getProvinceAdmin(provinceQueryConfig)
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Tỉnh/Thành phố</h1>
          <p className='text-sm italic'>Quản lý Tỉnh/Thành phố</p>
        </div>
        <DialogProvince>
          <Button>
            <PlusIcon />
            <span>Thêm Tỉnh/Thành phố</span>
          </Button>
        </DialogProvince>
      </div>
      <Separator />
      <div>
        <ProvinceTable provinces={provinces?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageProvince}
          queryConfig={provinceQueryConfig}
          pageSize={provinces?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
