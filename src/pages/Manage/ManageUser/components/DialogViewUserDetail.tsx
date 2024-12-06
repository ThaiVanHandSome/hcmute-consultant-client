import { getUserDetail, updateAdminUser } from '@/apis/user.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import InputCustom from '@/components/dev/Form/InputCustom'
import RadioGroupCustom from '@/components/dev/Form/RadioGroupCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import useUserQueryConfig from '@/hooks/useUserQueryConfig'
import { FormControlItem } from '@/types/utils.type'
import { isImageFile } from '@/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

const radioGroupData: FormControlItem[] = [
  {
    value: 'NAM',
    label: 'Nam'
  },
  {
    value: 'NU',
    label: 'Nữ'
  }
]

interface Props {
  readonly children: React.ReactNode
  readonly id: number
}

export interface AdminUserData {
  id: number
  schoolName: string
  firstName: string
  lastName: string
  phone: string
  gender: string
  line: string
  provinceFullName: string
  districtFullName: string
  wardFullName: string
}

export default function DialogViewUserDetail({ id, children }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const isFormReset = useRef<boolean>(false)
  const [file, setFile] = useState<File>()

  const form = useForm({
    defaultValues: {
      schoolName: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      line: '',
      provinceFullName: '',
      districtFullName: '',
      wardFullName: ''
    }
  })

  const { data: user } = useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: () => getUserDetail(id),
    enabled: !!id && open
  })

  const previewAvatarUrl = useMemo(() => {
    if (!user) return
    return file ? URL.createObjectURL(file) : (user?.data.data.avatarUrl ?? '')
  }, [file, user])

  const inputFileRef = useRef<HTMLInputElement>()
  const queryClient = useQueryClient()
  const userQueryConfig = useUserQueryConfig()

  useEffect(() => {
    if (user?.data.data) {
      const res = user?.data.data
      form.reset({
        schoolName: res.schoolName,
        firstName: res.firstName,
        lastName: res.lastName,
        phone: res.phone,
        gender: res.gender,
        provinceFullName: res.address?.provinceFullName ?? '',
        districtFullName: res.address?.districtFullName ?? '',
        wardFullName: res.address?.wardFullName ?? ''
      })
      isFormReset.current = true
    }
  }, [user, form])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'answer' | 'ask') => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  const handleChooseImage = () => {
    if (!inputFileRef) return
    inputFileRef.current?.click()
  }

  const updateAdminUserMutation = useMutation({
    mutationFn: ({ params, avatarUrl }: { params: AdminUserData; avatarUrl: File }) =>
      updateAdminUser(params, avatarUrl)
  })

  const onSubmit = form.handleSubmit((values) => {
    const { districtFullName, provinceFullName, wardFullName, ...rest } = values
    const params = {
      ...rest,
      id
    }
    updateAdminUserMutation.mutate(
      {
        params: params as AdminUserData,
        avatarUrl: file as File
      },
      {
        onSuccess: (res) => {
          toast({
            description: res.data.message
          })
          setOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['admin-users', userQueryConfig]
          })
        }
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Thông tin cá nhân</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <Input
                ref={inputFileRef}
                id='file'
                type='file'
                className='hidden'
                onChange={(e) => handleFileChange(e, 'answer')}
              />
              {previewAvatarUrl && (
                <div aria-hidden='true' onClick={handleChooseImage}>
                  <AvatarCustom url={previewAvatarUrl} className='size-28' />
                </div>
              )}
              <div className='grid grid-cols-2 mb-3 gap-4'>
                <div className='col-span-1'>
                  <InputCustom control={form.control} name='firstName' label='Họ' placeholder='Họ' />
                </div>
                <div className='col-span-1'>
                  <InputCustom control={form.control} name='lastName' label='Tên' placeholder='Tên' />
                </div>
              </div>
              <InputCustom control={form.control} name='schoolName' label='Trường học' placeholder='Trường học' />
              <InputCustom control={form.control} name='phone' label='Số điện thoại' placeholder='Số điện thoại' />
              <RadioGroupCustom
                control={form.control}
                name='gender'
                label='Giới tính'
                defaultValue={form.watch('gender')}
                data={radioGroupData}
              />
              <InputCustom disabled control={form.control} name='provinceFullName' label='Tỉnh' />
              <InputCustom disabled control={form.control} name='districtFullName' label='Huyện' />
              <InputCustom disabled control={form.control} name='wardFullName' label='Xã' />
              <Button disabled={updateAdminUserMutation.isPending} isLoading={updateAdminUserMutation.isPending} className='px-6 py-2 bg-primary text-primary-foreground'>Cập nhật</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
