import { checkJoinConsultation } from '@/apis/consultant.api'
import { Badge } from '@/components/ui/badge'
import { SchedualConsultant } from '@/types/consultant.type'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Building2 } from 'lucide-react'

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
    <Link to={`/schedule-activities/${scheduleActivity.id}`}>
      <div
        className='group relative bg-white rounded-lg hover:scale-[1.01] transition-all duration-300 p-4 
        hover:border-primary/10 hover:bg-primary/[0.01] shadow-xs hover:shadow-sm'
      >
        <div className='absolute top-3 right-3'>
          <Badge
            variant={isJoin ? 'default' : 'secondary'}
            className={`
              text-xs px-2 py-0.5
              ${isJoin ? 'bg-primary/80' : 'bg-gray-100'}
            `}
          >
            {isJoin ? 'Đã tham gia' : 'Chưa tham gia'}
          </Badge>
        </div>

        <h3
          className='text-base font-medium mb-3 line-clamp-2 pr-20 text-gray-700 
          group-hover:text-primary/90 transition-colors'
        >
          {scheduleActivity.title}
        </h3>

        <div className='flex flex-wrap items-center gap-3 mb-3 text-gray-600'>
          <div className='flex items-center'>
            <Calendar className='w-3.5 h-3.5 mr-1.5 text-primary/60' />
            <span className='text-xs'>{scheduleActivity.consultationDate}</span>
          </div>
          <div className='flex items-center'>
            <Clock className='w-3.5 h-3.5 mr-1.5 text-primary/60' />
            <span className='text-xs'>{scheduleActivity.consultationTime}AM</span>
          </div>
        </div>

        <div className='flex items-center text-gray-500'>
          <Building2 className='w-3.5 h-3.5 mr-1.5 text-primary/60' />
          <span className='text-xs'>
            {scheduleActivity?.department ? scheduleActivity?.department.name : 'Tất cả phòng ban'}
          </span>
        </div>
      </div>
    </Link>
  )
}
