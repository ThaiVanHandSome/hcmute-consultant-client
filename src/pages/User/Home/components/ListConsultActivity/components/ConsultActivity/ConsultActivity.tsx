import { SchedualConsultant } from '@/types/consultant.type'
import { Link } from 'react-router-dom'

interface Props {
  readonly scheduleActivity: SchedualConsultant
}

export default function ConsultActivity({ scheduleActivity }: Props) {
  return (
    <Link to={`/posts/${scheduleActivity.id}`} className='block'>
      <div className='border flex mb-3 hover:bg-secondary hover:text-secondary-foreground px-2 py-1 hover:transition-all cursor-pointer rounded-md overflow-hidden items-center'>
        <p className='flex-1 font-semibold text-md break-all line-clamp-2'>{scheduleActivity.title}</p>
      </div>
    </Link>
  )
}
