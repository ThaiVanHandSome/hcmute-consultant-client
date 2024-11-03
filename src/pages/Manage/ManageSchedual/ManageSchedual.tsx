import { getScheduals } from '@/apis/user.api'
import Paginate from '@/components/dev/PaginationCustom'
import SchedualItem from '@/components/dev/SchedualItem'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import SchedualFilter from '@/pages/Manage/ManageSchedual/components/SchedualFilter'
import { useQuery } from '@tanstack/react-query'

export default function ManageSchedual() {
  const schedualQueryConfig = useSchedualQueryConfig()

  const { data: schedualResponse } = useQuery({
    queryKey: ['schedules', schedualQueryConfig],
    queryFn: () => getScheduals(schedualQueryConfig)
  })
  const schedules = schedualResponse?.data.data.content

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-semibold text-lg'>Lịch tư vấn</h1>
        <p className='text-sm italic'>Quản lý lịch tư vấn</p>
      </div>
      <SchedualFilter queryConfig={schedualQueryConfig} />
      <Separator />
      <div className='bg-background'>
        {schedules?.map((schedule) => <SchedualItem key={schedule.id} schedual={schedule} />)}
      </div>
      <div>
        <Paginate
          path={path.manageSchedule}
          pageSize={schedualResponse?.data.data.totalPages as number}
          queryConfig={schedualQueryConfig}
        />
      </div>
    </div>
  )
}
