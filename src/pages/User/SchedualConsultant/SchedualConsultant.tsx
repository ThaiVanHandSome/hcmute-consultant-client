import { getTeacherConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import { createUserConsultant } from '@/apis/user.api'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { SchedualConsultantSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

export type ConsultantSchedualFormData = yup.InferType<typeof SchedualConsultantSchema>

export default function SchedualConsultant() {
  const form = useForm<ConsultantSchedualFormData>({
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

  const navigate = useNavigate()

  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('departmentId')
  console.log(departmentId)
  const { data: consultants } = useQuery({
    queryKey: ['teacher-consultants', departmentId],
    queryFn: () => getTeacherConsultantsByDepartment(parseInt(departmentId)),
    enabled: !!departmentId
  })

  // generate selection data from departments to use in selection component
  const consultantsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = consultants?.data.data
    return data?.map((consultant: Consultant) => {
      return {
        value: String(consultant.id),
        label: consultant.lastName + ' ' + consultant.firstName
      }
    })
  }, [consultants])

  const createUserConsultantMutation = useMutation({
    mutationFn: (body: ConsultantSchedualFormData) => createUserConsultant(body)
  })

  const onSubmit = form.handleSubmit((values) => {
    values.content = `<div class="editor">${values.content}</div>`
    createUserConsultantMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          title: 'Thành công',
          description: res.data.message
        })
        navigate(path.home)
      }
    })
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
                      name='consultantId'
                      placeholder='Người tư vấn'
                      data={consultantsSelectionData}
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
