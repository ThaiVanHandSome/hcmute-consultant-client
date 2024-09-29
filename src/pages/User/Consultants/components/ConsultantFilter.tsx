import { getAllDepartments } from '@/apis/department.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { FormControlItem } from '@/types/utils.type'
import { ConsultantsSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

interface Props {
  readonly consultantQueryConfig: ConsultantQueryConfig
}

export type ConsultantsFormData = yup.InferType<typeof ConsultantsSchema>

export default function ConsultantFilter({ consultantQueryConfig }: Props) {
  const form = useForm<ConsultantsFormData>({
    defaultValues: {
      departmentId: consultantQueryConfig.departmentId,
      name: consultantQueryConfig.name
    },
    resolver: yupResolver(ConsultantsSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const navigate = useNavigate()

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

  // when departmentId change, refetch data with new departmentId
  const departmentId = form.watch('departmentId')
  useEffect(() => {
    if (!departmentId) return
    navigate({
      pathname: path.consultants,
      search: createSearchParams({
        ...consultantQueryConfig,
        departmentId: departmentId,
        page: '0'
      }).toString()
    })
  }, [departmentId])

  return (
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
            <InputCustom className='mb-0' control={form.control} name='name' placeholder='Nhập tên ban tư vấn' />
          </div>
          <div className='col-span-2'>
            <Button type='submit' className='w-full'>
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
