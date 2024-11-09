import { getAdminUser } from '@/apis/user.api'
import Paginate from '@/components/dev/PaginationCustom'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import useUserQueryConfig from '@/hooks/useUserQueryConfig'
import UserTable from '@/pages/Manage/ManageUser/components/UserTable'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

export default function ManageUser() {
  const userQueryConfig = useUserQueryConfig()

  const { data: users } = useQuery({
    queryKey: ['admin-users', userQueryConfig],
    queryFn: () => getAdminUser(userQueryConfig)
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      isActivity: '',
      isOnline: ''
    }
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Tài khoản</h1>
          <p className='text-sm italic'>Quản lý tài khoản</p>
        </div>
        {/* <DialogRole>
          <Button>
            <PlusIcon />
            <span>Thêm quyền</span>
          </Button>
        </DialogRole> */}
      </div>
      <div>
        <Form {...form}>
          <form>
            
          </form>
        </Form>
      </div>
      <div>
        <UserTable users={users?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageUser}
          queryConfig={userQueryConfig}
          pageSize={users?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
