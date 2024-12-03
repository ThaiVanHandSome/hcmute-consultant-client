import { getScheduals } from '@/apis/user.api'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import path from '@/constants/path'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import ConsultActivity from '@/pages/User/Home/components/ListConsultActivity/components/ConsultActivity'
import { useQuery } from '@tanstack/react-query'

export default function ConsultActivityMobile() {
  let scheduleQueryConfig = useSchedualQueryConfig()
  scheduleQueryConfig = {
    ...scheduleQueryConfig,
    type: 'false'
  }
  const { data: scheduleActivities } = useQuery({
    queryKey: ['schedule-activities'],
    queryFn: () => getScheduals(scheduleQueryConfig)
  })
  const scheduleActivitiesData = scheduleActivities?.data.data.content
  return (
    <div className='py-2 w-full rounded-md shadow-md bg-primary-bg mb-4'>
      <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tư vấn</div>
      {!!scheduleActivitiesData && scheduleActivitiesData.length > 0 ? (
        <>
          <ul className='max-w-full w-full'>
            {scheduleActivitiesData.map((scheduleActivity) => (
              <ConsultActivity key={scheduleActivity.id} scheduleActivity={scheduleActivity} />
            ))}
          </ul>
          <div>
            <Paginate
              path={path.scheduleActivities}
              queryConfig={scheduleQueryConfig}
              pageSize={scheduleActivities?.data.data.totalPages as number}
              RANGE={1}
              showChooseQuantity={false}
            />
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center text-gray-400 bg-primary-bg py-4 rounded-md shadow-sm'>
          <p className='text-center text-sm'>Không có hoạt động nào để hiển thị</p>
        </div>
      )}
    </div>
  )
}
