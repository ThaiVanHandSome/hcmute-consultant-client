import { cancelConsultation, checkJoinConsultation, getScheduleDetail, joinSchedule } from '@/apis/consultant.api'
import { getScheduals } from '@/apis/user.api'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, createSearchParams, useParams } from 'react-router-dom'

export default function ScheduleActivity() {
  let scheduleQueryConfig = useSchedualQueryConfig()
  scheduleQueryConfig = {
    ...scheduleQueryConfig,
    type: 'false'
  }
  const params = useParams()
  const id = parseInt(params.id as string)

  const { data: scheduleActivities } = useQuery({
    queryKey: ['schedule-activities', scheduleQueryConfig],
    queryFn: () => getScheduals(scheduleQueryConfig)
  })

  const { data: scheduleActivityRes } = useQuery({
    queryKey: ['schedule-activity', id],
    queryFn: () => getScheduleDetail(id),
    enabled: !!id
  })
  const scheduleActivity = scheduleActivityRes?.data.data

  const joinScheduleMutation = useMutation({
    mutationFn: (id: number) => joinSchedule(id)
  })

  const cancelScheduleMutation = useMutation({
    mutationFn: (id: number) => cancelConsultation(id)
  })

  const { data: isJoinRes, refetch } = useQuery({
    queryKey: ['check-join', id],
    queryFn: () => checkJoinConsultation(id)
  })
  const isJoin = isJoinRes?.data.data

  const handleJoinSchedule = () => {
    const id = scheduleActivity?.id
    joinScheduleMutation.mutate(id as number, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
        refetch()
      }
    })
  }

  const handleCancelSchedule = () => {
    const id = scheduleActivity?.id
    cancelScheduleMutation.mutate(id as number, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
        refetch()
      }
    })
  }

  return (
    <div className='h-remain-screen grid grid-cols-12'>
      <div className='hidden lg:block col-span-4 px-3 py-1 border-r bg-background'>
        <div className='mb-2 py-2 rounded-md font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
        {scheduleActivities?.data.data.content.map((scheduleActivity) => (
          <Link
            key={scheduleActivity.id}
            to={{
              pathname: `/schedule-activities/${scheduleActivity.id}`,
              search: createSearchParams(scheduleQueryConfig).toString()
            }}
            className={clsx('block border mb-3 px-2 py-1 hover:transition-all cursor-pointer rounded-md w-full', {
              'hover:bg-secondary hover:text-secondary-foreground': id !== scheduleActivity.id,
              'bg-secondary text-secondary-foreground': id === scheduleActivity.id
            })}
          >
            <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{scheduleActivity.title}</p>
            <p className='text-xs font-semibold text-muted-foreground'>
              {scheduleActivity.department.name} - {scheduleActivity.consultationDate}
            </p>
          </Link>
        ))}
        <Separator className='my-2' />
        <div>
          <Paginate
            path={`/schedules-activities/${id}`}
            queryConfig={scheduleQueryConfig}
            pageSize={scheduleActivities?.data.data.totalPages as number}
            RANGE={1}
            showChooseQuantity={false}
          />
        </div>
      </div>
      <div className='col-span-12 lg:col-span-8'>
        <div className='px-2 py-3 flex items-center justify-between shadow-md'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <p className='text-sm font-semibold'>{scheduleActivity?.department.name}</p>
            </div>
          </div>
        </div>
        <Separator />
        <div className='bg-background'>
          <div className='px-4 py-2 min-h-2'>
            <p className='text-4xl font-semibold'>{scheduleActivity?.title}</p>
            <div dangerouslySetInnerHTML={{ __html: scheduleActivity?.content as string }} className='mb-2'></div>
            <div className='space-y-2 text-sm'>
              <p>
                Buổi tư vấn sẽ được diễn ra vào ngày <b>{scheduleActivity?.consultationDate}</b> vào lúc{' '}
                <b>{scheduleActivity?.consultationTime}</b>
              </p>
              <p>
                <b>Hình thức:</b> {scheduleActivity?.mode ? 'Online' : 'Offline'}
              </p>
              {scheduleActivity?.mode && (
                <p>
                  <b>Link Google Meet:</b> {scheduleActivity.link}
                </p>
              )}
              {!scheduleActivity?.mode && (
                <p>
                  <b>Địa điểm:</b> {scheduleActivity?.location}
                </p>
              )}
              <p>Vui lòng chọn tham gia nếu bạn muốn tham gia nhé!</p>
              {!isJoin && (
                <Button
                  disabled={joinScheduleMutation.isPending}
                  isLoading={joinScheduleMutation.isPending}
                  onClick={handleJoinSchedule}
                >
                  Tham gia
                </Button>
              )}
              {isJoin && (
                <Button
                  variant='destructive'
                  disabled={cancelScheduleMutation.isPending}
                  isLoading={cancelScheduleMutation.isPending}
                  onClick={handleCancelSchedule}
                >
                  Hủy
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
