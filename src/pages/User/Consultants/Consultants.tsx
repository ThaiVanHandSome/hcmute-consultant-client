import { getAllConsultant } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import DataTable from '@/components/dev/DataTable'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import PaginationCustom from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useConsultantQueryConfig, { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { columns } from '@/pages/User/Consultants/columns'
import { FormControlItem } from '@/types/utils.type'
import { ConsultantsSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

type FormData = yup.InferType<typeof ConsultantsSchema>

export default function Consultants() {
  const consultantQueryConfig: ConsultantQueryConfig = useConsultantQueryConfig()
  const form = useForm<FormData>({
    defaultValues: {
      departmentId: consultantQueryConfig.name,
      name: consultantQueryConfig.name
    },
    resolver: yupResolver(ConsultantsSchema)
  })

  const navigate = useNavigate()

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const { data: consultants } = useQuery({
    queryKey: ['consultant', consultantQueryConfig],
    queryFn: () => getAllConsultant(consultantQueryConfig)
  })

  // generate selection data from departments to use in selection component 
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const onSubmit = form.handleSubmit((values) => {
    const name = values.name
    if (name) {
      navigate({
        pathname: path.consultants,
        search: createSearchParams({
          ...consultantQueryConfig,
          name
        }).toString()
      })
    }
  })

  const departmentId = form.watch('departmentId')
  
  // when departmentId change, refetch data with new departmentId
  useEffect(() => {
    if (!departmentId) return
    navigate({
      pathname: path.consultants,
      search: createSearchParams({
        ...consultantQueryConfig,
        departmentId: departmentId
      }).toString()
    })
  }, [departmentId])

  return (
    <div className='bg-primary-bg py-6'>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-[80%] bg-white px-2 py-4 shadow-lg rounded-lg'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>TƯ VẤN VIÊN</h1>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className='grid grid-cols-12 gap-4 items-center'>
                  <div className='col-span-4'>
                    <SelectionCustom
                      className='mb-0'
                      control={form.control}
                      name='departmentId'
                      placeholder='Lọc theo đơn vị'
                      defaultValue={consultantQueryConfig.departmentId}
                      data={departmentsSelectionData}
                    />
                  </div>
                  <div className='col-span-6'>
                    <InputCustom
                      className='mb-0'
                      control={form.control}
                      name='name'
                      placeholder='Nhập tên ban tư vấn'
                    />
                  </div>
                  <div className='col-span-2'>
                    <Button type='submit' className='w-full'>
                      Tìm kiếm
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            <Separator className='my-6' />
            <div className='mb-4'>
              {consultants?.data.data.content && (
                <DataTable data={consultants?.data.data.content} columns={columns} />
              )}
            </div>
            <PaginationCustom
              path={path.consultants}
              queryConfig={consultantQueryConfig}
              pageSize={consultants?.data.data.totalPages as number}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
