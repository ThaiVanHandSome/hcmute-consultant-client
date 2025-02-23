import { useState } from 'react'
import { cancelConsultation, checkJoinConsultation, getScheduleDetail, joinSchedule } from '@/apis/consultant.api'
import { getScheduals } from '@/apis/user.api'
import Paginate from '@/components/dev/PaginationCustom/PaginationCustom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useSchedualQueryConfig from '@/hooks/useSchedualQueryConfig'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, createSearchParams, useParams } from 'react-router-dom'
import SuccessDialog from '@/pages/User/ScheduleActivity/components/SuccessDialog'
import { CalendarClockIcon, ComponentIcon, LinkIcon, MapPinIcon } from 'lucide-react'

export default function ScheduleActivity() {
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
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
    mutationFn: (id: number) => joinSchedule(id),
    onSuccess: (res) => {
      setDialogMessage(res.data.message)
      setShowDialog(true)
      refetch()
    }
  })

  const cancelScheduleMutation = useMutation({
    mutationFn: (id: number) => cancelConsultation(id),
    onSuccess: (res) => {
      setDialogMessage(res.data.message)
      setShowDialog(true)
      refetch()
    }
  })

  const { data: isJoinRes, refetch } = useQuery({
    queryKey: ['check-join', id],
    queryFn: () => checkJoinConsultation(id)
  })
  const isJoin = isJoinRes?.data.data

  const handleJoinSchedule = () => {
    const id = scheduleActivity?.id
    joinScheduleMutation.mutate(id as number)
  }

  const handleCancelSchedule = () => {
    const id = scheduleActivity?.id
    cancelScheduleMutation.mutate(id as number)
  }

  return (
    <div className='h-remain-screen grid grid-cols-12'>
      <div className='hidden lg:block col-span-4 px-3 py-1 border-r bg-primary-bg'>
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
            <div className='px-1 py-1'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>
                  {scheduleActivity?.department ? scheduleActivity?.department.name : 'Tất cả phòng ban'}
                </p>
                <Badge variant='destructive'>
                  {scheduleActivity.consultationDate} {scheduleActivity.consultationTime}AM
                </Badge>
              </div>
              <p className='flex-1 text-md break-all line-clamp-2 mt-2'>{scheduleActivity.title}</p>
              <div className='flex items-center space-x-1 mt-1'>
                {scheduleActivity?.mode ? (
                  <Badge className='bg-muted text-muted-foreground'>Online</Badge>
                ) : (
                  <Badge className='bg-muted text-muted-foreground'>Offline</Badge>
                )}
                {scheduleActivity?.statusPublic ? (
                  <Badge className='bg-muted text-muted-foreground'>Công khai</Badge>
                ) : (
                  <Badge className='bg-muted text-muted-foreground'>Riêng tư</Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
        <Separator className='my-2' />
        <div>
          <Paginate
            path={`/schedule-activities/${id}`}
            queryConfig={scheduleQueryConfig}
            pageSize={scheduleActivities?.data.data.totalPages as number}
            RANGE={1}
            showChooseQuantity={false}
          />
        </div>
      </div>
      <div className='col-span-12 lg:col-span-8'>
        <div className='px-2 py-3 flex items-center justify-between shadow-md'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center space-x-1'>
              <p className='text-sm font-semibold'>{scheduleActivity?.department?.name ?? 'Tất cả phòng ban'}</p>
            </div>
            <div className='flex items-center justify-end'>
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
                  Hủy tham gia
                </Button>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <div className='bg-background'>
          <div className='px-4 py-2 min-h-2'>
            <div className='grid grid-cols-3 gap-4 mt-2 mb-4'>
              <div className='flex flex-col items-center justify-center rounded-md p-2 border shadow-md bg-accent text-accent-foreground'>
                <div>
                  <ComponentIcon className='size-10 mb-3' strokeWidth={1.25} />
                </div>
                <p className='font-semibold text-md text-primary'>{scheduleActivity?.mode ? 'Online' : 'Offline'}</p>
              </div>
              <div className='flex flex-col items-center justify-center rounded-md p-2 border shadow-md bg-accent text-accent-foreground'>
                {scheduleActivity?.location && (
                  <>
                    <div>
                      <MapPinIcon className='size-10 mb-3' strokeWidth={1.25} />
                    </div>
                    <p className='font-semibold text-md text-primary'>{scheduleActivity?.location}</p>
                  </>
                )}
                {scheduleActivity?.link && (
                  <>
                    <div>
                      <LinkIcon className='size-10 mb-3' strokeWidth={1.25} />
                    </div>
                    <p className='font-semibold text-md text-primary'>{scheduleActivity?.link}</p>
                  </>
                )}
              </div>
              <div className='flex flex-col items-center justify-center rounded-md p-2 border shadow-md bg-accent text-accent-foreground'>
                <div>
                  <CalendarClockIcon className='size-10 mb-3' strokeWidth={1.25} />
                </div>
                <p className='font-semibold text-md text-primary'>
                  {scheduleActivity?.consultationDate} {scheduleActivity?.consultationTime}AM
                </p>
              </div>
            </div>
            <p className='text-4xl font-semibold'>{scheduleActivity?.title}</p>
            <div dangerouslySetInnerHTML={{ __html: scheduleActivity?.content as string }} className='mb-2'></div>
          </div>
        </div>
      </div>
      {showDialog && (
        <SuccessDialog message={dialogMessage} onClose={() => setShowDialog(false)} navigateTo='/some-page' />
      )}
    </div>
  )
}
