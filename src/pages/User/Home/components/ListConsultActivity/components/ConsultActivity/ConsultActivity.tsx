import { checkJoinConsultation } from '@/apis/consultant.api'
import { Badge } from '@/components/ui/badge'
import { SchedualConsultant } from '@/types/consultant.type'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

interface Props {
  readonly scheduleActivity: SchedualConsultant
}

export default function ConsultActivity({ scheduleActivity }: Props) {
  const id = scheduleActivity.id
  const { data: isJoinRes } = useQuery({
    queryKey: ['check-join', id],
    queryFn: () => checkJoinConsultation(id)
  })
  const isJoin = isJoinRes?.data.data
  return (
    <Link to={`/schedule-activities/${scheduleActivity.id}`} className='block'>
      <div className='border mb-3 hover:bg-secondary hover:text-secondary-foreground px-3 py-2 hover:transition-all cursor-pointer rounded-md overflow-hidden items-center'>
        <div>
          <div className='flex items-center justify-between'>
            <Badge variant='destructive'>
              {scheduleActivity.consultationDate} {scheduleActivity.consultationTime}AM
            </Badge>{' '}
            {isJoin ? (
              <span className='font-semibold text-primary text-xs'>Đã tham gia</span>
            ) : (
              <span className='font-semibold text-muted-foreground text-xs'>Chưa tham gia</span>
            )}
          </div>
          {/* <Separator className='mt-2 mb-1' /> */}
          <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{scheduleActivity.title}</p>
          <p className='text-xs font-semibold text-muted-foreground'>
            {scheduleActivity?.department ? scheduleActivity?.department.name : 'Tất cả phòng ban'}
          </p>
        </div>
      </div>
    </Link>
  )
}
