import { getAdminAskRole } from '@/apis/role.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useConsultantRoleQueryConfig from '@/hooks/useConsultantRoleQueryConfig'
import AskRoleTable from '@/pages/Manage/ManageAskRole/components/AskRoleTable'
import DialogAskRole from '@/pages/Manage/ManageAskRole/components/DialogAskRole'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageAskRole() {
  const consultantRoleQueryConfig = useConsultantRoleQueryConfig()
  const { data: askRoles } = useQuery({
    queryKey: ['admin-ask-roles', consultantRoleQueryConfig],
    queryFn: () => getAdminAskRole(consultantRoleQueryConfig)
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
      pathname: path.manageAskRole,
      search: createSearchParams({
        ...consultantRoleQueryConfig,
        name
      }).toString()
    })
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Quyền người hỏi</h1>
          <p className='text-sm italic'>Quản lý quyền người hỏi</p>
        </div>
        <DialogAskRole>
          <Button>
            <PlusIcon />
            <span>Thêm quyền người hỏi</span>
          </Button>
        </DialogAskRole>
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
        <AskRoleTable roles={askRoles?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageAskRole}
          queryConfig={consultantRoleQueryConfig}
          pageSize={askRoles?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
