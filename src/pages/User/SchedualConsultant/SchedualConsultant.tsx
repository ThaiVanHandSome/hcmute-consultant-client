import { getTeacherConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import { createUserConsultant } from '@/apis/user.api'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { SchedualConsultantSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MailWarningIcon } from 'lucide-react'
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
          description: res.data.message
        })
        navigate(path.home)
      }
    })
  })
  return (
    <div className='bg-primary-bg'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='bg-background text-foreground px-6 py-2 col-span-9 rounded-lg shadow-lg mt-6'>
            <h1 className='font-extrabold text-2xl text-left uppercase mb-6 text-primary'>Đặt lịch tư vấn</h1>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <Label className='text-md italic relative inline-flex items-center before:inline-block after:inline-block before:w-4 after:w-4 before:h-[1px] after:h-[1px] before:bg-current after:bg-current before:mr-2 after:ml-2'>
                  Nơi tiếp nhận
                </Label>
                <div className='w-full grid grid-cols-2 gap-4 mb-6 mt-1'>
                  <div className='col-span-1'>
                    <SelectionCustom
                      control={form.control}
                      name='departmentId'
                      placeholder='Đơn vị'
                      label='Đơn vị'
                      data={departmentsSelectionData}
                    />
                  </div>
                  <div className='col-span-1'>
                    <SelectionCustom
                      control={form.control}
                      name='consultantId'
                      placeholder='Tư vấn viên'
                      label='Tư vấn viên'
                      data={consultantsSelectionData}
                    />
                  </div>
                </div>
                <Label className='text-md italic relative inline-flex items-center before:inline-block after:inline-block before:w-4 after:w-4 before:h-[1px] after:h-[1px] before:bg-current after:bg-current before:mr-2 after:ml-2'>
                  Nội dung cần tư vấn
                </Label>
                <InputCustom
                  className='mt-1 mb-3'
                  control={form.control}
                  name='title'
                  placeholder='Tiêu đề'
                  label='Tiêu đề'
                />
                <Editor label='Nội dung' control={form.control} name='content' />
                <CheckboxCustom control={form.control} name='statusPublic' label='Chế độ công khai' />
                <CheckboxCustom control={form.control} name='mode' label='Online' />
                <div className='flex items-center justify-center'>
                  <Button type='submit' className='w-1/3'>
                    Đặt lịch
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className='col-span-3 mt-6'>
            <div className='px-4 py-4 bg-background text-foreground rounded-lg shadow-md mb-6'>
              <p className='text-xl font-semibold text-blue-600 mb-2 uppercase'>Tiêu chí</p>
              <p className='text-md mb-3'>
                Nếu bạn muốn gặp mặt trực tiếp hoặc online tư vấn viên, hãy đặt lịch tư vấn tại đây
              </p>
              <p className='text-md mb-3'>
                Sau khi đặt lịch, sẽ mất khoảng <strong>3 ngày</strong> để yêu cầu của bạn được xem xét và được duyệt.
                Hãy chú ý thông báo nhé!
              </p>
              <div className='px-4 py-3 bg-red-100 border-l-4 border-red-600 text-red-700 mb-3 rounded'>
                <p className='text-md font-bold mb-1 flex items-center'>
                  <MailWarningIcon className='mr-1' />
                  Cảnh báo:
                </p>
                <p className='text-md'>
                  Vui lòng không đặt lịch tư vấn nếu không có nhu cầu. Nếu như bạn hủy lịch tư vấn với một lý do{' '}
                  <strong>không chính đáng</strong>, bạn sẽ bị <strong>khóa tài khoản</strong>. Nếu bạn muốn mở lại tài
                  khoản, vui lòng liên hệ quản trị viên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
