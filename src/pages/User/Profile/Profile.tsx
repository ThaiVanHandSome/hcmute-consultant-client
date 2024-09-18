import { getDistricts, getProvinces, getWards } from '@/apis/location.api'
import { getProfile, updateProfile } from '@/apis/user.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import RadioGroupCustom from '@/components/dev/Form/RadioGroupCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import { User } from '@/types/user.type'
import { FormControlItem } from '@/types/utils.type'
import { setUserToLocalStorage } from '@/utils/auth'
import { generateSelectionDataFromLocation } from '@/utils/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
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

export default function Profile() {
  const { setUser } = useContext(AppContext)
  const isFormReset = useRef<boolean>(false)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const btnChooseImageRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      schoolName: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      line: '',
      provinceCode: '',
      districtCode: '',
      wardCode: ''
    }
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !isFormReset.current
  })

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces
  })
  const provincesSelectionData = useMemo(() => {
    const data = provinces?.data.data
    return generateSelectionDataFromLocation(data)
  }, [provinces])

  const provinceCode = form.watch('provinceCode')
  const { data: districts } = useQuery({
    queryKey: ['districts', provinceCode],
    queryFn: () => getDistricts(provinceCode),
    enabled: !!provinceCode
  })
  const districtsSelectionData = useMemo(() => {
    const data = districts?.data.data
    return generateSelectionDataFromLocation(data)
  }, [districts])

  const districtCode = form.watch('districtCode')
  const { data: wards } = useQuery({
    queryKey: ['wards', districtCode],
    queryFn: () => getWards(districtCode),
    enabled: !!districtCode
  })
  const wardsSelectionData = useMemo(() => {
    const data = wards?.data.data
    return generateSelectionDataFromLocation(data)
  }, [wards])

  const updateProfileMutation = useMutation({
    mutationFn: (body: Omit<User, 'id'>) => updateProfile(body)
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  useEffect(() => {
    if (profile?.data.data) {
      const res = profile?.data.data
      form.reset({
        username: res.username,
        email: res.email,
        schoolName: res.schoolName,
        firstName: res.firstName,
        lastName: res.lastName,
        phone: res.phone,
        gender: res.gender,
        provinceCode: res.address?.provinceCode ?? '',
        districtCode: res.address?.districtCode ?? '',
        wardCode: res.address?.wardCode ?? ''
      })
      isFormReset.current = true
    }
  }, [profile, form])

  const onSubmit = form.handleSubmit((values) => {
    const payload: Omit<User, 'id'> = {
      username: values.username,
      studentCode: '',
      schoolName: values.schoolName,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      avatarUrl: '',
      gender: values.gender,
      address: {
        line: values.line,
        provinceCode: values.provinceCode,
        districtCode: values.districtCode,
        wardCode: values.wardCode
      },
      email: values.email
    }
    updateProfileMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          title: 'Thành công',
          description: res.data.message
        })
        setUser(payload as User)
        setUserToLocalStorage(payload as User)
      }
    })
  })

  return (
    <div>
      <h1 className='font-bold mb-4 text-primary'>Hồ Sơ Cá Nhân</h1>
      <div className='grid grid-cols-5'>
        <div className='col-span-3'>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom disabled control={form.control} name='username' label='Username' />
              <InputCustom disabled control={form.control} name='email' label='Email' />
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
              {isFormReset.current && (
                <div className='mb-5'>
                  <FormLabel className='w-full mb-2 block'>Địa chỉ</FormLabel>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='col-span-1'>
                      <SelectionCustom
                        control={form.control}
                        name='provinceCode'
                        placeholder='Tỉnh'
                        defaultValue={form.getValues('provinceCode')}
                        data={provincesSelectionData}
                      />
                    </div>
                    <div className='col-span-1'>
                      <SelectionCustom
                        control={form.control}
                        name='districtCode'
                        placeholder='Huyện'
                        defaultValue={form.getValues('districtCode')}
                        data={districtsSelectionData}
                      />
                    </div>
                    <div className='col-span-1'>
                      <SelectionCustom
                        control={form.control}
                        name='wardCode'
                        placeholder='Xã'
                        defaultValue={form.getValues('wardCode')}
                        data={wardsSelectionData}
                      />
                    </div>
                  </div>
                </div>
              )}
              <Button
                isLoading={updateProfileMutation.isPending}
                disabled={updateProfileMutation.isPending}
                className='px-6 py-2'
              >
                Cập nhật
              </Button>
            </form>
          </Form>
        </div>
        <div className='col-span-2 flex items-center justify-center'>
          <div className='flex flex-col items-center'>
            <img
              src={
                previewImage ||
                'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=Tfkhgvffv3cQ7kNvgERMbSU&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=ADHfltbhANdWHLfZtFl-Hqm&oh=00_AYDYXIj0aYVvkcSodbUivsAJUDUuTAQLGcbUF-sBdafZwQ&oe=66E1DC27'
              }
              alt='avatar'
              className='size-56 rounded-full'
            />
            <Button variant='secondary' className='mt-4' onClick={() => btnChooseImageRef.current?.click()}>
              Chọn ảnh
            </Button>
            <Input
              accept='.jpg,.jpeg,.png'
              ref={btnChooseImageRef}
              id='file'
              type='file'
              onChange={handleFileChange}
              className='hidden'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
