import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { questionStatus } from '@/constants/questionStatus'
import { dialogViewType } from '@/pages/User/MyQuestion/MyQuestion'
import { Question as QuestionType } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { DotsHorizontalIcon, FileTextIcon, GlobeIcon, TrashIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly question: QuestionType
  readonly openDialog: (type: string) => void
  readonly setQuestionActive: React.Dispatch<React.SetStateAction<QuestionType | undefined>>
}

export default function QuestionStatisticView({ question, openDialog, setQuestionActive, className }: Props) {
  const handleOpenDialog = (type: string) => {
    setQuestionActive(question)
    openDialog(type)
  }

  const renderHeaderQuestionComponent = () => (
    <div>
      <div className='flex items-start justify-between'>
        <div className='flex items-center mb-2'>
          <img src={question.askerAvatarUrl} alt='avatar' className='size-10 mr-2 rounded-full' />
          <div>
            <div className='font-bold mr-2 text-sm'>
              {question.askerFirstname} {question.askerLastname}
            </div>
            <div className='text-xs text-gray-400 flex items-center'>
              <span className='mr-1'>{formatDate(question.createdAt)}</span>
              <GlobeIcon />
            </div>
          </div>
        </div>
        <div className='flex items-center'>
          {question.questionFilterStatus === questionStatus.deleted && <Badge variant='destructive'>Đã xóa</Badge>}
          <div className='ml-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DotsHorizontalIcon className='size-5 text-primary cursor-pointer' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleOpenDialog(dialogViewType.detail)}
                  className='flex items-center gap-1 text-primary font-semibold'
                >
                  <FileTextIcon />
                  <span>Xem chi tiết</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenDialog(dialogViewType.deleteConfirm)}
                  className='flex items-center gap-1 text-destructive font-semibold'
                >
                  <TrashIcon />
                  <span>Xóa câu hỏi</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className='px-2'>
        <div className='text-blue-600 font-semibold text-sm'>#{question.department.name}</div>
        <div className='mb-3 text-blue-600 font-semibold text-sm'>#{question.field.name}</div>
        <div className='font-semibold text-md italic mb-2'>🎯 {question.title}</div>
      </div>
    </div>
  )

  return (
    <div>
      <div className={clsx(className, 'rounded-lg bg-primary-bg')}>
        <div className='px-4 py-3 rounded-lg shadow-md mb-6'>{renderHeaderQuestionComponent()}</div>
      </div>
    </div>
  )
}
