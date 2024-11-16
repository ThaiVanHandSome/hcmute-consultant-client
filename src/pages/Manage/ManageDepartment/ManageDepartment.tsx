import { getAdminDepartment } from '@/apis/department.api'
import ExportCustom from '@/components/dev/ExportCustom'
import InputCustom from '@/components/dev/Form/InputCustom'
import Paginate from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useDepartmentQueryConfig from '@/hooks/useDepartmentQueryConfig'
import DepartmentTable from '@/pages/Manage/ManageDepartment/components/DepartmentTable'
import DialogDepartment from '@/pages/Manage/ManageDepartment/components/DialogDepartment'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageDepartment() {
  const departmentQueryConfig = useDepartmentQueryConfig()

  const { data: departments } = useQuery({
    queryKey: ['admin-departments', departmentQueryConfig],
    queryFn: () => getAdminDepartment(departmentQueryConfig)
  })

  const form = useForm({
    defaultValues: {
      name: ''
    }
  })

  const navigate = useNavigate()

  const onSubmit = form.handleSubmit((values) => {
    const name = values.name.trim()
    navigate({
      pathname: path.manageDepartment,
      search: createSearchParams({
        ...departmentQueryConfig,
        name
      }).toString()
    })
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Khoa</h1>
          <p className='text-sm italic'>Quản lý khoa</p>
        </div>
        <div className='flex items-center space-x-2'>
          <DialogDepartment>
            <Button>
              <PlusIcon />
              <span>Thêm khoa</span>
            </Button>
          </DialogDepartment>
          <ExportCustom dataType='department' queryConfig={departmentQueryConfig} />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className='grid grid-cols-12 gap-2'>
              <div className='col-span-4'>
                <InputCustom control={form.control} name='name' placeholder='Nhập tên để tìm kiếm' />
              </div>
              <div className='col-span-1'>
                <Button>Tìm kiếm</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div>
        <DepartmentTable departments={departments?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageDepartment}
          queryConfig={departmentQueryConfig}
          pageSize={departments?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
