import { getAdminUser } from '@/apis/user.api'
import ExportCustom from '@/components/dev/ExportCustom'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import Paginate from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import useUserQueryConfig from '@/hooks/useUserQueryConfig'
import UserTable from '@/pages/Manage/ManageUser/components/UserTable'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageUser() {
  const userQueryConfig = useUserQueryConfig()

  const { data: users } = useQuery({
    queryKey: ['admin-users', userQueryConfig],
    queryFn: () => getAdminUser(userQueryConfig)
  })

  const form = useForm({
    defaultValues: {
      email: '',
      isActivity: ''
    }
  })

  const isActivitySelectionData = [
    {
      value: 'true',
      label: 'Còn sử dụng'
    },
    {
      value: 'false',
      label: 'Không còn sử dụng'
    }
  ]

  const navigate = useNavigate()

  const isActivity = form.watch('isActivity')
  useEffect(() => {
    if (!isActivity) return
    navigate({
      pathname: path.manageUser,
      search: createSearchParams({
        ...userQueryConfig,
        isActivity: String(isActivity === 'true' ? true : false)
      }).toString()
    })
  }, [isActivity])

  const onSubmit = form.handleSubmit((values) => {
    const email = values.email
    navigate({
      pathname: path.manageUser,
      search: createSearchParams({
        ...userQueryConfig,
        email
      }).toString()
    })
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Tài khoản</h1>
          <p className='text-sm italic'>Quản lý tài khoản</p>
        </div>
        <ExportCustom dataType='userInformation' queryConfig={userQueryConfig} />
      </div>
      <div className='mb-3'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className='space-y-4'>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-3'>
                  <SelectionCustom
                    control={form.control}
                    name='isActivity'
                    placeholder='Trạng thái'
                    data={isActivitySelectionData}
                  />
                </div>
                <div className='col-span-4'>
                  <InputCustom control={form.control} name='email' placeholder='Nhập email để tìm kiếm' />
                </div>
                <div className='col-span-1'>
                  <Button>Tìm kiếm</Button>
                </div>
              </div>
            </div>
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
