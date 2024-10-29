import { getConsultantsByDepartment } from '@/apis/consultant.api'
import { createGroupConversation, createUserConversation } from '@/apis/conversation.api'
import { getAllDepartments } from '@/apis/department.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import { ConversationQueryConfig } from '@/hooks/useConversationQueryConfig'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateConversationSchema, CreateGroupConversationSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly conversationQueryParams: ConversationQueryConfig
}

export type ConversationFormData = yup.InferType<typeof CreateConversationSchema>
export type GroupConversationFormData = yup.InferType<typeof CreateGroupConversationSchema>

export default function CreateNewConversation({ conversationQueryParams }: Props) {
  const { role } = useContext(AppContext)
  const queryClient = useQueryClient()

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const createConversationForm = useForm<ConversationFormData>({
    defaultValues: {
      consultantId: '',
      departmentId: ''
    },
    resolver: yupResolver(CreateConversationSchema)
  })

  const createGroupConversationForm = useForm<GroupConversationFormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(CreateGroupConversationSchema)
  })

  const createConversationMutation = useMutation({
    mutationFn: (body: ConversationFormData) => createUserConversation(body)
  })

  const createGroupConversationMutation = useMutation({
    mutationFn: (body: GroupConversationFormData) => createGroupConversation(body)
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

  const departmentId = createConversationForm.watch('departmentId')
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
  const onUserSubmit = createConversationForm.handleSubmit((values) => {
    createConversationMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setIsOpenModal(false)
        queryClient.invalidateQueries({
          queryKey: ['conversations', conversationQueryParams]
        })
      }
    })
  })

  const onConsultantSubmit = createGroupConversationForm.handleSubmit((values) =>
    createGroupConversationMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setIsOpenModal(false)
        queryClient.invalidateQueries({
          queryKey: ['conversations', conversationQueryParams]
        })
      }
    })
  )

  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>
        <Pencil2Icon className='size-7 cursor-pointer ml-2' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo đoạn chat mới</DialogTitle>
        </DialogHeader>
        {role === ROLE.user && (
          <Form {...createConversationForm}>
            <form onSubmit={onUserSubmit}>
              <div className='mb-4'>
                <SelectionCustom
                  control={createConversationForm.control}
                  name='departmentId'
                  placeholder='Chọn phòng ban'
                  data={departmentsSelectionData}
                />
              </div>
              <div className='mb-4'>
                <SelectionCustom
                  control={createConversationForm.control}
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
        )}
        {role === ROLE.consultant && (
          <Form {...createGroupConversationForm}>
            <form onSubmit={onConsultantSubmit}>
              <div className='mb-4'>
                <InputCustom control={createGroupConversationForm.control} name='name' placeholder='Nhập tên nhóm' />
              </div>
              <div className='flex items-center justify-center'>
                <Button
                  isLoading={createGroupConversationMutation.isPending}
                  disabled={createGroupConversationMutation.isPending}
                  type='submit'
                  className='w-full'
                >
                  Tạo
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
