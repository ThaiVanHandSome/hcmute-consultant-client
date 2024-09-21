import { getConsultantsByDepartment } from '@/apis/consultant.api'
import { createUserConversation, getUserConversation } from '@/apis/conversation.api'
import { getAllDepartments } from '@/apis/department.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import MessageItem from '@/components/dev/MessageItem'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import useConversationQueryConfig from '@/hooks/useConversationQueryConfig'
import { Consultant } from '@/types/consultant.type'
import { Conversation } from '@/types/conversation.type'
import { FormControlItem } from '@/types/utils.type'
import { CreateConversationSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { ImageIcon, MagnifyingGlassIcon, PaperPlaneIcon, Pencil2Icon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MessageCircleIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const friendAvatar =
  'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/311590829_1254153242092852_4832227332157715848_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGNnmpAkRiZt0npaCZ4oArImf3JOiEdXRuZ_ck6IR1dGwgrTcgAYPXDlKYJIj1Ihc1NJ4SfxczRdoQ60WCQDr4g&_nc_ohc=3F_zqbfttEoQ7kNvgEtIi4g&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AVkOFBUh1UonSwKYwmEKFnY&oh=00_AYCjlHOhy6FXEACkoDhHUFGkG0-e_3wchilTmo_lJV4HVQ&oe=66F45ED2'
const fakeData = [
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message:
      'helloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  },
  {
    id: 1,
    message: 'hellooooooooooooo'
  },
  {
    id: 2,
    message: 'hellooooooooooooo'
  }
]

export type UserConversationFormData = yup.InferType<typeof CreateConversationSchema>

export default function Message() {
  const conversationQueryParams = useConversationQueryConfig()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const form = useForm<UserConversationFormData>({
    defaultValues: {
      consultantId: '',
      departmentId: '',
      name: ''
    },
    resolver: yupResolver(CreateConversationSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })
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
  const consultantsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = consultants?.data.data
    return data?.map((consultant: Consultant) => {
      return {
        value: String(consultant.id),
        label: consultant.lastName + ' ' + consultant.firstName
      }
    })
  }, [consultants])

  const { data: userConversations, refetch } = useQuery({
    queryKey: ['user-conversations', conversationQueryParams],
    queryFn: () => getUserConversation(conversationQueryParams)
  })

  const createConversationMutation = useMutation({
    mutationFn: (body: UserConversationFormData) => createUserConversation(body)
  })

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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [])

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
            <Dialog open={isOpenModal}>
              <DialogTrigger asChild>
                <Pencil2Icon className='size-7 cursor-pointer ml-2' onClick={() => setIsOpenModal(true)} />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo đoạn chat mới</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={onSubmit}>
                    <InputCustom control={form.control} name='name' placeholder='Tên cuộc hội thoại' />
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
          </div>
          <Separator className='mt-4' />
          <div className='mt-3 flex-grow overflow-y-auto h-full px-4'>
            {userConversations?.data.data.content.map((conversation: Conversation) => (
              <MessageItem key={conversation.id} conversation={conversation} />
            ))}
          </div>
        </div>
        <div className='col-span-8 flex flex-col h-remain-screen'>
          <div>
            <div className='flex items-center py-2 shadow-lg px-3'>
              <img
                src='https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=-zpoaE3hKksQ7kNvgHKM4JO&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYDWrgK1AuTcKAaPFhlUcPMX1s7Q9vZPSnQG2LM3s2Rcvg&oe=66F45127'
                alt='avatar'
                className='size-10 rounded-full'
              />
              <div className='ml-2'>
                <p className='font-bold text-lg'>Nguyễn Thái Văn</p>
              </div>
            </div>
          </div>
          <div className='flex-1 h-full flex-grow overflow-y-auto px-4'>
            {/* {fakeData.map((item, index) => {
              if (item.id !== 1) {
                let avatarCanShow = false
                if ((index + 1 < fakeData.length && fakeData[index + 1].id === 1) || index === fakeData.length - 1)
                  avatarCanShow = true
                return (
                  <div key={item.id} className='flex justify-start my-3'>
                    <div className='flex items-center'>
                      {avatarCanShow && <img src={friendAvatar} alt='avatar' className='size-8 rounded-full' />}
                      {!avatarCanShow && <div className='size-8'></div>}
                      <div className='ml-2 p-2 bg-slate-200 rounded-3xl'>{item.message}</div>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={item.id} className='flex justify-end my-3 '>
                    <div className='p-2 rounded-3xl bg-primary text-white max-w-[50%] break-words'>{item.message}</div>
                  </div>
                )
              }
            })} */}
            <div ref={messagesEndRef}></div>
          </div>
          <div className='shadow-lg px-3 py-2 flex items-center w-full'>
            <div>
              <ImageIcon className='size-7 mr-2 text-primary cursor-pointer' />
            </div>
            <div className='flex-1'>
              <Input className='!rounded-lg' />
            </div>
            <PaperPlaneIcon className='size-7 ml-2 text-primary cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  )
}
