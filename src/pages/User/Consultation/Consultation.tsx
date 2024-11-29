import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import NoDataIcon from '@/assets/images/utils/no-data.png'
import DataTable from '@/components/dev/DataTable'
import PaginationCustom from '@/components/dev/PaginationCustom'
import path from '@/constants/path'
import { getConsultationJoin } from '@/apis/user.api'
import ConsultationFilter from '@/pages/User/Consultation/components/ConsultationFilter'
import useConsultationQueryConfig from '@/hooks/useConsultationQueryConfig'
import { columns } from '@/pages/User/Consultation/components/columns'

export default function Consultation() {
  const consultationQueryConfig = useConsultationQueryConfig()

  const { data: consultations } = useQuery({
    queryKey: ['consultation-joins', consultationQueryConfig],
    queryFn: () => getConsultationJoin(consultationQueryConfig)
  })

  return (
    <div>
      <div className='mb-6'>
        <ConsultationFilter queryConfig={consultationQueryConfig} />
      </div>
      <Separator className='my-8' />
      <div>
        {!consultations && (
          <div className='flex items-center justify-center'>
            <img src={NoDataIcon} alt='no-data' className='size-48' />
          </div>
        )}
        <div className='mb-4'>
          {consultations?.data.data.content && (
            <DataTable data={consultations.data.data.content} columns={columns} size={consultations.data.data.size} />
          )}
        </div>
        <PaginationCustom
          path={path.consultation}
          queryConfig={consultationQueryConfig}
          pageSize={consultations?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
