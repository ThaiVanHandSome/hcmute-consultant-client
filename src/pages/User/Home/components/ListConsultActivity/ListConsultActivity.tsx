import { getScheduals } from '@/apis/user.api'
import { Button } from '@/components/ui/button'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import ConsultActivity from '@/pages/User/Home/components/ListConsultActivity/components/ConsultActivity'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

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

  const [isShowAll, setIsShowAll] = useState<boolean>(false)
  const scheduleActivitiesData = useMemo(() => {
    if (!isShowAll) return scheduleActivities?.data.data.content.slice(0, 2)
    return scheduleActivities?.data.data.content
  }, [isShowAll, scheduleActivities])

  return (
    <div className='py-2 w-full rounded-md shadow-md bg-background mb-4'>
      <div className='mb-1 py-1 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tư vấn</div>
      {!!scheduleActivitiesData && scheduleActivitiesData.length > 0 ? (
        <>
          <ul className='max-w-full w-full'>
            {scheduleActivitiesData.map((scheduleActivity) => (
              <ConsultActivity key={scheduleActivity.id} scheduleActivity={scheduleActivity} />
            ))}
          </ul>
          <div className='flex items-center justify-center'>
            <Button
              variant='outline'
              className='bg-secondary text-secondary-foreground px-2 h-8 text-xs flex items-center gap-1'
              onClick={() => setIsShowAll((prev) => !prev)}
            >
              {isShowAll ? (
                <>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 15l7-7 7 7'></path>
                  </svg>
                  Thu gọn
                </>
              ) : (
                <>
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'></path>
                  </svg>
                  Xem thêm
                </>
              )}
            </Button>
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
