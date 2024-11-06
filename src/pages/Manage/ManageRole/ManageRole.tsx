import { getAdminRole } from '@/apis/role.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useRoleQueryConfig from '@/hooks/useRoleQueryConfig'
import DialogRole from '@/pages/Manage/ManageRole/components/DialogRole'
import RoleTable from '@/pages/Manage/ManageRole/components/RoleTable'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageRole() {
  const roleQueryConfig = useRoleQueryConfig()
  const { data: roles } = useQuery({
    queryKey: ['admin-roles', roleQueryConfig],
    queryFn: () => getAdminRole(roleQueryConfig)
  })

  const form = useForm({
    defaultValues: {
      name: ''
    }
  })

  const navigate = useNavigate()
  const onSubmit = form.handleSubmit((values) => {
    const name = values.name.trim()
    if (!name) return
    navigate({
      pathname: path.manageRole,
      search: createSearchParams({
        ...roleQueryConfig,
        name
      }).toString()
    })
  })
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Quyền</h1>
          <p className='text-sm italic'>Quản lý quyền</p>
        </div>
        <DialogRole>
          <Button>
            <PlusIcon />
            <span>Thêm quyền</span>
          </Button>
        </DialogRole>
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
        <RoleTable roles={roles?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageRole}
          queryConfig={roleQueryConfig}
          pageSize={roles?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
