import { Badge } from '@/components/ui/badge'
import { SchedualConsultant } from '@/types/consultant.type'
import { Link } from 'react-router-dom'

interface Props {
  readonly schedual?: SchedualConsultant
}

export default function SchedualItem({ schedual }: Props) {
  return (
    <Link to={`/manage/schedules/detail/${schedual?.id}`}>
      <div className='hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg rounded-md cursor-pointer py-2 px-4 border-b '>
        <div className='grid grid-cols-12 items-center gap-4 text-sm py-1'>
          <div className='col-span-3 font-semibold truncate'>{schedual?.department.name}</div>
          <div className='col-span-5 truncate'>{schedual?.title}</div>
          <div className='col-span-4 text-xs text-right italic space-x-2'>
            <span className='text-xs italic'>
              {schedual?.consultationDate} {schedual?.consultationTime}
            </span>
            {schedual?.mode ? <Badge>Online</Badge> : <Badge>Offline</Badge>}
            {schedual?.statusPublic ? <Badge variant='destructive'>Công khai</Badge> : <Badge>Riêng tư</Badge>}
            <Badge variant='outline'>{schedual?.statusConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
