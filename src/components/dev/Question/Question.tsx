import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Eye, User, ThumbsUp } from 'lucide-react'
import { Question as QuestionType } from '@/types/question.type'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly question: QuestionType
}

export default function Question({ question, className }: Props) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200',
        'hover:border-blue-200 hover:shadow-sm',
        'transition-all duration-300',
        className
      )}
    >
      <div className='p-5'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src={question.askerAvatarUrl} />
              <AvatarFallback>
                <User className='h-5 w-5 text-gray-400' />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='font-medium text-gray-900'>
                {question.askerFirstname} {question.askerLastname}
              </h3>
              <time className='text-sm text-gray-500'>
                {format(new Date(question.createdAt), 'dd MMM yyyy', { locale: vi })}
              </time>
            </div>
          </div>
          <div className='flex items-center gap-4 text-sm text-gray-500'>
            <div className='flex items-center gap-1.5'>
              <Eye className='h-4 w-4' strokeWidth={1.5} />
              <span>{question.views}</span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              className={cn('gap-1.5', isLiked ? 'text-blue-600' : 'text-gray-500')}
              onClick={() => setIsLiked(!isLiked)}
            >
              <ThumbsUp className={cn('h-4 w-4', isLiked && 'fill-current')} strokeWidth={1.5} />
              <span>123</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='mt-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Badge variant='secondary' className='bg-blue-50 text-blue-600'>
              {question.department.name}
            </Badge>
            <Badge variant='secondary' className='bg-indigo-50 text-indigo-600'>
              {question.field.name}
            </Badge>
          </div>
          <h2 className='text-lg font-semibold text-gray-900'>{question.title}</h2>
          <p className='mt-2 text-gray-600 line-clamp-2'>{question.content}</p>
        </div>

        {/* Answer Preview */}
        {question.answerContent && (
          <div className='mt-4 pt-4 border-t border-gray-100'>
            <div className='flex items-start gap-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={question.answerAvatarUrl} />
                <AvatarFallback>
                  <User className='h-4 w-4 text-gray-400' />
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-900'>
                    {question.answerUserFirstname} {question.answerUserLastname}
                  </span>
                  <time className='text-sm text-gray-500'>
                    {format(new Date(question.answerCreatedAt), 'dd MMM yyyy', { locale: vi })}
                  </time>
                </div>
                <p className='mt-1 text-gray-600 text-sm line-clamp-2'>{question.answerContent}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
