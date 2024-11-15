import { getUserDetail } from '@/apis/user.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import RadioGroupCustom from '@/components/dev/Form/RadioGroupCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { FormControlItem } from '@/types/utils.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
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

export default function DialogViewUserDetail({ id, children }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const isFormReset = useRef<boolean>(false)

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

  console.log(user)

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

  const onSubmit = form.handleSubmit((values) => {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông tin cá nhân</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
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
              <Button className='px-6 py-2 bg-primary text-primary-foreground'>Cập nhật</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
