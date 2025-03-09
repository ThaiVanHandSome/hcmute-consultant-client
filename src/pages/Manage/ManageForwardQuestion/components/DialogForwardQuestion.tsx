import { getConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import { updateForwardQuestion } from '@/apis/question.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from 'sonner'
import useForwardQuestionQueryConfig from '@/hooks/useForwardQuestionQueryConfig'
import { Consultant } from '@/types/consultant.type'
import { ForwardQuestion } from '@/types/question.type'
import { FormControlItem } from '@/types/utils.type'
import { ForwardQuestionSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export type ForwardQuestionFormData = yup.InferType<typeof ForwardQuestionSchema>

interface Props {
  readonly children: React.ReactNode
  readonly forwardQuestion: ForwardQuestion
}

export default function DialogForwardQuestion({ children, forwardQuestion }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const forwardQuestionQueryConfig = useForwardQuestionQueryConfig()
  const queryClient = useQueryClient()

  const form = useForm<ForwardQuestionFormData>({
    defaultValues: {
      consultantId: String(forwardQuestion.consultant.id),
      toDepartmentId: String(forwardQuestion.toDepartment.id),
      title: forwardQuestion.title,
      questionId: String(forwardQuestion.questionId)
    }
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  // generate selection data from departments to use in selection component
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('toDepartmentId')
  const { data: consultants } = useQuery({
    queryKey: ['consultantsByDepartment', departmentId],
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

  const updateForwardQuestionMutation = useMutation({
    mutationFn: ({ body, forwardQuestionId }: { body: ForwardQuestionFormData; forwardQuestionId: number }) =>
      updateForwardQuestion(body, forwardQuestionId)
  })

  const onSubmit = form.handleSubmit((values) => {
    updateForwardQuestionMutation.mutate(
      {
        body: values,
        forwardQuestionId: forwardQuestion.id
      },
      {
        onSuccess: (res) => {
          toast.success(res.data.message)
          queryClient.invalidateQueries({
            queryKey: ['forward-questions', forwardQuestionQueryConfig]
          })
          setOpen(false)
        }
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa câu hỏi chuyển tiếp</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='title' label='Tiêu đề' />
              <SelectionCustom
                classNameSelection='max-h-[30vh]'
                control={form.control}
                name='toDepartmentId'
                label='Phòng ban'
                data={departmentsSelectionData}
              />
              <SelectionCustom
                control={form.control}
                name='consultantId'
                label='Tư vấn viên'
                data={consultantsSelectionData}
              />
              <Button
                disabled={updateForwardQuestionMutation.isPending}
                isLoading={updateForwardQuestionMutation.isPending}
                className='mt-2'
              >
                Lưu
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
