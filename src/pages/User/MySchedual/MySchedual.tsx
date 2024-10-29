import { Separator } from '@/components/ui/separator'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import MySchedualFilter from '@/pages/User/MySchedual/components/MySchedualFilter'
import { useQuery } from '@tanstack/react-query'
import NoDataIcon from '@/assets/images/utils/no-data.png'
import DataTable from '@/components/dev/DataTable'
import { columns } from '@/pages/User/MySchedual/components/columns'
import PaginationCustom from '@/components/dev/PaginationCustom'
import path from '@/constants/path'
import { getScheduals } from '@/apis/user.api'

export default function MySchedual() {
  const schedualQueryConfig = useSchedualQueryConfig()

  const { data: schedualConsultants } = useQuery({
    queryKey: ['schedual-consultants', schedualQueryConfig],
    queryFn: () => getScheduals(schedualQueryConfig)
  })

  return (
    <div>
      <div className='mb-6'>
        <MySchedualFilter queryConfig={schedualQueryConfig} />
      </div>
      <Separator className='my-8' />
      <div>
        {!schedualConsultants && (
          <div className='flex items-center justify-center'>
            <img src={NoDataIcon} alt='no-data' className='size-48' />
          </div>
        )}
        <div className='mb-4'>
          {schedualConsultants?.data.data.content && (
            <DataTable
              data={schedualConsultants.data.data.content}
              columns={columns}
              size={schedualConsultants.data.data.size}
            />
          )}
        </div>
        <PaginationCustom
          path={path.mySchedual}
          queryConfig={schedualQueryConfig}
          pageSize={schedualConsultants?.data.data.totalPages as number}
        />
      </div>
    </div>
  )
}
