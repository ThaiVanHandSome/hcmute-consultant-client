import { getConsultantsByDepartment } from '@/apis/consultant.api'
import { createUserConversation } from '@/apis/conversation.api'
import { getAllDepartments } from '@/apis/department.api'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { ConversationQueryConfig } from '@/hooks/useConversationQueryConfig'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateConversationSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly conversationQueryParams: ConversationQueryConfig
}

export type UserConversationFormData = yup.InferType<typeof CreateConversationSchema>

export default function CreateNewConversation({ conversationQueryParams }: Props) {
  const queryClient = useQueryClient()

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const form = useForm<UserConversationFormData>({
    defaultValues: {
      consultantId: '',
      departmentId: ''
    },
    resolver: yupResolver(CreateConversationSchema)
  })

  const createConversationMutation = useMutation({
    mutationFn: (body: UserConversationFormData) => createUserConversation(body)
  })

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
    queryKey: ['consultantsByDepartment', departmentId],
    queryFn: () => getConsultantsByDepartment(departmentId),
    enabled: !!departmentId
  })

  // generate selection data
  const consultantsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = consultants?.data.data
    return data?.map((consultant: Consultant) => {
      return {
        value: String(consultant.id),
        label: consultant.lastName + consultant.firstName
      }
    })
  }, [consultants])

  // handle create new conversation with new consultant
  const onSubmit = form.handleSubmit((values) => {
    createConversationMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          title: 'Thành công',
          description: res.data.message
        })
        setIsOpenModal(false)
        queryClient.invalidateQueries({
          queryKey: [['conversations', conversationQueryParams]]
        })
      }
    })
  })
  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>
        <Pencil2Icon className='size-7 cursor-pointer ml-2' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo đoạn chat mới</DialogTitle>
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
                isLoading={createConversationMutation.isPending}
                disabled={createConversationMutation.isPending}
                type='submit'
                className='w-full'
              >
                Tạo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}