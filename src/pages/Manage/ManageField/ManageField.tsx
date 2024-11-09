import { getAllDepartments } from '@/apis/department.api'
import { getAdminField } from '@/apis/field.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import Paginate from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useFieldQueryConfig from '@/hooks/useFieldQueryConfig'
import DialogField from '@/pages/Manage/ManageField/components/DialogField'
import FieldTable from '@/pages/Manage/ManageField/components/FieldTable'
import { FormControlItem } from '@/types/utils.type'
import { generateSelectionData } from '@/utils/utils'
import { PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function ManageField() {
  const fieldQueryConfig = useFieldQueryConfig()
  const { data: fields } = useQuery({
    queryKey: ['admin-fields', fieldQueryConfig],
    queryFn: () => getAdminField(fieldQueryConfig)
  })

  const form = useForm({
    defaultValues: {
      name: '',
      departmentId: ''
    }
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const navigate = useNavigate()

  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('departmentId')
  useEffect(() => {
    navigate({
      pathname: path.manageField,
      search: createSearchParams({
        ...fieldQueryConfig,
        departmentId
      }).toString()
    })
  }, [departmentId, navigate])

  const onSubmit = form.handleSubmit((values) => {
    const name = values.name.trim()
    if (!name) return
    navigate({
      pathname: path.manageField,
      search: createSearchParams({
        ...fieldQueryConfig,
        name
      }).toString()
    })
  })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Lĩnh vực</h1>
          <p className='text-sm italic'>Quản lý lĩnh vực</p>
        </div>
        <DialogField>
          <Button>
            <PlusIcon />
            <span>Thêm lĩnh vực</span>
          </Button>
        </DialogField>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className='grid grid-cols-12 gap-2'>
              <div className='col-span-3'>
                <SelectionCustom
                  control={form.control}
                  name='departmentId'
                  data={departmentsSelectionData}
                  placeholder='Khoa'
                />
              </div>
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
        <FieldTable fields={fields?.data.data.content} />
      </div>
      <div>
        <Paginate
          path={path.manageField}
          queryConfig={fieldQueryConfig}
          pageSize={fields?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
