import { getDistricts, getProvinces, getWards } from '@/apis/location.api'
import { getProfile, updateProfile } from '@/apis/user.api'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/types/user.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function Profile() {
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
    queryFn: getProfile
  })

  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces
  })

  const provinceCode = form.watch('provinceCode')
  const { data: districts } = useQuery({
    queryKey: ['districts', provinceCode],
    queryFn: () => getDistricts(provinceCode),
    enabled: provinceCode.length !== 0
  })

  const districtCode = form.watch('districtCode')
  const { data: wards } = useQuery({
    queryKey: ['wards', districtCode],
    queryFn: () => getWards(districtCode),
    enabled: districtCode.length !== 0
  })

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
      form.setValue('username', res.username)
      form.setValue('email', res.email)
      form.setValue('schoolName', res.schoolName)
      form.setValue('firstName', res.firstName)
      form.setValue('lastName', res.lastName)
      form.setValue('phone', res.phone)
      form.setValue('gender', res.gender)
      form.setValue('provinceCode', res.address?.provinceCode ?? '')
      form.setValue('districtCode', res.address?.districtCode ?? '')
      form.setValue('wardCode', res.address?.wardCode ?? '')
    }
  }, [profile])

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
        toast.success(res.data.message)
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
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='mb-3'>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input disabled value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='mb-3'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 mb-3 gap-4'>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ</FormLabel>
                        <FormControl>
                          <Input placeholder='Họ' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1'>
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input placeholder='Tên' {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name='schoolName'
                render={({ field }) => (
                  <FormItem className='mb-3'>
                    <FormLabel>Trường học</FormLabel>
                    <FormControl>
                      <Input placeholder='Trường học' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='mb-4'>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='Số điện thoại' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='mb-5'>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex items-center'
                      >
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='NAM' />
                          </FormControl>
                          <FormLabel className='!mt-0 ml-1'>Nam</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center'>
                          <FormControl>
                            <RadioGroupItem value='NU' />
                          </FormControl>
                          <FormLabel className='!mt-0 ml-1'>Nữ</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='mb-5'>
                <FormLabel className='w-full mb-2 block'>Địa chỉ</FormLabel>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='col-span-1'>
                    <FormField
                      control={form.control}
                      name='provinceCode'
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Tỉnh' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces?.data.data.map((province) => (
                                <SelectItem key={province.code} value={String(province.code)}>
                                  {province.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-1'>
                    <FormField
                      control={form.control}
                      name='districtCode'
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Huyện' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts?.data.data.map((district) => (
                                <SelectItem key={district.code} value={String(district.code)}>
                                  {district.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='col-span-1'>
                    <FormField
                      control={form.control}
                      name='wardCode'
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Xã' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wards?.data.data.map((ward) => (
                                <SelectItem key={ward.code} value={String(ward.code)}>
                                  {ward.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
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
