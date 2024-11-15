import { Badge } from '@/components/ui/badge'
import { Question } from '@/types/question.type'
import { Link } from 'react-router-dom'

interface Props {
  readonly question?: Question
  readonly isApproval?: boolean
}

export default function QuestionItem({ question, isApproval = false }: Props) {
  const endPoint = isApproval
    ? `/manage/approval-answers/detail/${question?.id}?status=APPROVAL`
    : `/manage/questions/detail/${question?.id}`
  return (
    <Link to={endPoint}>
      <div className='hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg rounded-md cursor-pointer py-2 px-4 border-b '>
        <div className='flex items-center justify-between mb-1'>
          <Badge>{question?.field.name}</Badge>
          <div className='flex items-center space-x-1 justify-end'>
            {question?.filterStatus.map((status) => (
              <Badge variant='secondary' key={status}>
                {status}
              </Badge>
            ))}
          </div>
        </div>
        <div className='grid grid-cols-12 items-center gap-4 text-sm py-1'>
          <div className='col-span-3 font-semibold truncate'>{question?.department.name}</div>
          <div className='col-span-7 truncate'>{question?.title}</div>
          <div className='col-span-2 text-xs text-right italic'>
            {new Date(question?.createdAt ?? '').toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  )
}
