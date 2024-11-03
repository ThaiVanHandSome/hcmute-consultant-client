import { getConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import { forwardQuestion } from '@/apis/question.api'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateConversationSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

interface Props {
  readonly questionId: number
}

type FormData = yup.InferType<typeof CreateConversationSchema>

export default function DialogForwardQuestion({ questionId }: Props) {
  const form = useForm<FormData>({
    defaultValues: {
      departmentId: '',
      consultantId: ''
    },
    resolver: yupResolver(CreateConversationSchema)
  })

  const navigate = useNavigate()

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('departmentId')
  const { data: consultants } = useQuery({
    queryKey: ['teacher-consultants', departmentId],
    queryFn: () => getConsultantsByDepartment(departmentId),
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

  const forwardQuestionMutation = useMutation({
    mutationFn: (body: { toDepartmentId: number; questionId: number; consultantId: number }) =>
      forwardQuestion(body)
  })

  const onSubmit = form.handleSubmit((values) => {
    const body = {
      toDepartmentId: parseInt(values.departmentId),
      consultantId: parseInt(values.consultantId),
      questionId
    }
    forwardQuestionMutation.mutate(body, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        navigate(path.manageQuestion)
      }
    })
  })

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='outline'>Chuyển tiếp</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển tiếp câu hỏi</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className='mb-4'>
              <SelectionCustom
                control={form.control}
                name='departmentId'
                placeholder='Chọn phòng ban'
                data={departmentsSelectionData}
              />
            </div>
            <div className='mb-4'>
              <SelectionCustom
                control={form.control}
                name='consultantId'
                placeholder='Chọn tư vấn viên'
                data={consultantsSelectionData}
              />
            </div>
            <div className='flex items-center justify-center'>
              <Button
                isLoading={forwardQuestionMutation.isPending}
                disabled={forwardQuestionMutation.isPending}
                type='submit'
                className='w-full'
              >
                Chuyển tiếp
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
