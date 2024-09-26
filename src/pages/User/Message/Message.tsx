import { getConsultantsByDepartment } from '@/apis/consultant.api'
import {
  createUserConversation,
  getConsultantConversation,
  getConversations,
  getUserConversation
} from '@/apis/conversation.api'
import { getAllDepartments } from '@/apis/department.api'
import Chat from '@/components/dev/Chat'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import MessageItem from '@/components/dev/MessageItem'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'
import useQueryParams from '@/hooks/useQueryParams'
import { Consultant } from '@/types/consultant.type'
import { Conversation } from '@/types/conversation.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateConversationSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { MagnifyingGlassIcon, Pencil2Icon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MessageCircleIcon } from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

export type UserConversationFormData = yup.InferType<typeof CreateConversationSchema>

export default function Message() {
  const { role } = useContext(AppContext)
  const { id } = useQueryParams()
  const navigate = useNavigate()
  const conversationQueryParams = useConversationQueryConfig()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [conversationActive, setConversationActive] = useState<Conversation>()
  const form = useForm<UserConversationFormData>({
    defaultValues: {
      consultantId: '',
      departmentId: ''
    },
    resolver: yupResolver(CreateConversationSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
    enabled: role === ROLE.user
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
    enabled: !!departmentId && role === ROLE.user
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

  const { data: conversations, refetch } = useQuery({
    queryKey: ['conversations', conversationQueryParams],
    queryFn: () => getConversations(conversationQueryParams)
  })

  const createConversationMutation = useMutation({
    mutationFn: (body: UserConversationFormData) => createUserConversation(body)
  })

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
        refetch()
      }
    })
  })

  // when access to component, choose the first conversation and show it
  useEffect(() => {
    if (!conversations || id) return
    const data = conversations.data.data.content
    if (data.length !== 0) {
      navigate({
        pathname: path.messages,
        search: createSearchParams({
          id: String(data[0].id)
        }).toString()
      })
    }
  }, [conversations, id, navigate])

  // handle when user choose other conversation
  useEffect(() => {
    if (!conversations) return
    const data = conversations.data.data.content
    const conversationActive = data.find((obj) => obj.id === parseInt(id))
    setConversationActive(conversationActive as Conversation)
  }, [conversations, id])

  return (
    <div className='bg-white'>
      <div className='grid grid-cols-12'>
        <div className='col-span-4 px-4 border-r border-gray-300 flex flex-col h-remain-screen'>
          <h1 className='font-semibold text-xl mb-2 text-primary flex items-center pt-3'>
            <MessageCircleIcon />
            <span className='ml-1'>Nhắn tin</span>
          </h1>
          <div className='flex items-center'>
            <div className='flex items-center w-full border border-gray-200 rounded-md px-4 py-1 flex-1'>
              <div className='flex-1 flex-shrink-0'>
                <input placeholder='Tìm kiếm' className='focus:outline-none focus:border-none text-sm w-full' />
              </div>
              <MagnifyingGlassIcon className='size-7 text-gray-400 cursor-pointer' />
            </div>
            {role === ROLE.user && (
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
            )}
          </div>
          <Separator className='mt-4' />
          <div className='mt-3 flex-grow overflow-y-auto h-full px-4'>
            {conversations?.data.data.content.map((conversation: Conversation) => (
              <MessageItem
                key={conversation.id}
                conversation={conversation}
                conversationIdActive={conversationActive?.id}
              />
            ))}
          </div>
        </div>
        <div className='col-span-8'>
          <Chat conversation={conversationActive} />
        </div>
      </div>
    </div>
  )
}
