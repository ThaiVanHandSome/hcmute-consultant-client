import { getAllDepartments } from '@/apis/department.api'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormControlItem } from '@/types/utils.type'
import { SchedualConsultantSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = yup.InferType<typeof SchedualConsultantSchema>

export default function SchedualConsultant() {
  const form = useForm<FormData>({
    defaultValues: {
      consultantId: 'qw',
      departmentId: '',
      title: '',
      content: '',
      statusPublic: true,
      mode: true
    },
    resolver: yupResolver(SchedualConsultantSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const onSubmit = form.handleSubmit((values) => {
    console.log(values)
  })
  return (
    <div>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='bg-white px-6 py-2 w-3/4 rounded-lg shadow-lg mt-6'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Đặt lịch tư vấn</h1>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className='w-full grid grid-cols-2 gap-4 mb-3'>
                  <div className='col-span-1'>
                    <SelectionCustom
                      control={form.control}
                      name='departmentId'
                      placeholder='Đơn vị'
                      data={departmentsSelectionData}
                    />
                  </div>
                  <div className='col-span-1'>
                    <SelectionCustom
                      control={form.control}
                      name='departmentId'
                      placeholder='Người tư vấn'
                      data={departmentsSelectionData}
                    />
                  </div>
                </div>
                <InputCustom control={form.control} name='title' placeholder='Tiêu đề' label='Tiêu đề' />
                <Editor label='Nội dung' control={form.control} name='content' />
                <CheckboxCustom control={form.control} name='statusPublic' label='Chế độ công khai' />
                <CheckboxCustom control={form.control} name='mode' label='Online' />
                <Button type='submit'>Đặt lịch</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
