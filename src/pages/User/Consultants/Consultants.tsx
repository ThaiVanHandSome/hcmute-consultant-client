import { getAllDepartments } from '@/apis/department.api'
import DataTable from '@/components/dev/DataTable'
import InputCustom from '@/components/dev/InputCustom'
import SelectionCustom from '@/components/dev/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { columns } from '@/pages/User/Consultants/columns'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { ConsultantsSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = yup.InferType<typeof ConsultantsSchema>

const data: Consultant[] = [
  {
    id: 1,
    name: 'Nguyễn Hữu Trung',
    phoneNumber: '01234589',
    email: 'jbcd@gmail.com',
    avatar:
      'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=Tfkhgvffv3cQ7kNvgERMbSU&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=ADHfltbhANdWHLfZtFl-Hqm&oh=00_AYDYXIj0aYVvkcSodbUivsAJUDUuTAQLGcbUF-sBdafZwQ&oe=66E1DC27',
    department: 'Khoa Công Nghệ Thông Tin'
  },
  {
    id: 2,
    name: 'Nguyễn Hữu Trung',
    phoneNumber: '0456789',
    email: 'bahsd@gmail.com',
    avatar:
      'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=Tfkhgvffv3cQ7kNvgERMbSU&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=ADHfltbhANdWHLfZtFl-Hqm&oh=00_AYDYXIj0aYVvkcSodbUivsAJUDUuTAQLGcbUF-sBdafZwQ&oe=66E1DC27',
    department: 'Khoa Công Nghệ Thông Tin'
  },
  {
    id: 3,
    name: 'Nguyễn Hữu Trung',
    phoneNumber: '01234567',
    email: 'zkajs@gmail.com',
    avatar:
      'https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/435116190_1794745547688837_695033224121990189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEFOc7dmSSU7vb15NsbXRVcAbRqSYGR-PMBtGpJgZH483la9c7bx87IipYQAJCmaNUFuB_I6V1GglCT7OUisAKa&_nc_ohc=Tfkhgvffv3cQ7kNvgERMbSU&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=ADHfltbhANdWHLfZtFl-Hqm&oh=00_AYDYXIj0aYVvkcSodbUivsAJUDUuTAQLGcbUF-sBdafZwQ&oe=66E1DC27',
    department: 'Khoa Công Nghệ Thông Tin'
  }
]

export default function Consultants() {
  const form = useForm<FormData>({
    defaultValues: {
      departmentId: '',
      title: ''
    },
    resolver: yupResolver(ConsultantsSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const onSubmit = form.handleSubmit((values) => {
    console.log(values)
  })
  return (
    <div className='bg-primary-bg py-6'>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-[80%] bg-white px-2 py-4 shadow-lg rounded-lg'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>TƯ VẤN VIÊN</h1>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className='grid grid-cols-12 gap-4 items-center'>
                  <div className='col-span-4'>
                    <SelectionCustom
                      className='mb-0'
                      control={form.control}
                      name='departmentId'
                      placeholder='Lọc theo đơn vị'
                      data={departmentsSelectionData}
                    />
                  </div>
                  <div className='col-span-6'>
                    <InputCustom
                      className='mb-0'
                      control={form.control}
                      name='title'
                      placeholder='Nhập tên ban tư vấn'
                    />
                  </div>
                  <div className='col-span-2'>
                    <Button type='submit' className='w-full'>
                      Tìm kiếm
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            <Separator className='my-6' />
            <div>
              <DataTable data={data} columns={columns} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
