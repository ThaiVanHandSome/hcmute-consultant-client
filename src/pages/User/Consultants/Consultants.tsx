import { getAllConsultant } from '@/apis/consultant.api'
import DataTable from '@/components/dev/DataTable'
import PaginationCustom from '@/components/dev/PaginationCustom'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useConsultantQueryConfig, { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { columns } from '@/pages/User/Consultants/columns'
import ConsultantFilter from '@/pages/User/Consultants/components/ConsultantFilter'
import { useQuery } from '@tanstack/react-query'

export default function Consultants() {
  const consultantQueryConfig: ConsultantQueryConfig = useConsultantQueryConfig()

  const { data: consultants } = useQuery({
    queryKey: ['consultant', consultantQueryConfig],
    queryFn: () => getAllConsultant(consultantQueryConfig)
  })

  return (
    <div className='bg-primary-bg py-6 min-h-[100vh]'>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-[80%] bg-background text-foreground px-2 py-4 shadow-lg rounded-lg'>
            <h1 className='font-extrabold text-2xl text-center uppercase mb-6 text-primary'>TƯ VẤN VIÊN</h1>
            <ConsultantFilter consultantQueryConfig={consultantQueryConfig} />
            <Separator className='my-6' />
            <div className='mb-4'>
              {consultants?.data.data.content && (
                <DataTable data={consultants?.data.data.content} columns={columns} size={consultants.data.data.size} />
              )}
            </div>
            <PaginationCustom
              path={path.consultants}
              queryConfig={consultantQueryConfig}
              pageSize={consultants?.data.data.totalPages as number}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
