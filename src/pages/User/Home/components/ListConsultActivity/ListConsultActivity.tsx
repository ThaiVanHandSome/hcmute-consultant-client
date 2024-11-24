import { getScheduals } from '@/apis/user.api'
import { Button } from '@/components/ui/button'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import ConsultActivity from '@/pages/User/Home/components/ListConsultActivity/components/ConsultActivity'
import { useQuery } from '@tanstack/react-query'

export default function ListConsultActivity() {
  let scheduleQueryConfig = useSchedualQueryConfig()
  scheduleQueryConfig = {
    ...scheduleQueryConfig,
    type: 'false',
    page: '0',
    size: '10000'
  }
  const { data: scheduleActivities } = useQuery({
    queryKey: ['schedule-activities'],
    queryFn: () => getScheduals(scheduleQueryConfig)
  })
  return (
    <div className='py-2 w-full rounded-md shadow-md bg-primary-bg mb-4'>
      <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tư vấn</div>
      {!!scheduleActivities && scheduleActivities.data.data.content.length > 0 ? (
        <>
          <ul className='max-w-full w-full'>
            {scheduleActivities?.data.data.content.map((scheduleActivity) => (
              <ConsultActivity key={scheduleActivity.id} scheduleActivity={scheduleActivity} />
            ))}
          </ul>
          <div className='flex items-center justify-center'>
            <Button className='px-2 h-8 text-xs'>Xem thêm</Button>
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
