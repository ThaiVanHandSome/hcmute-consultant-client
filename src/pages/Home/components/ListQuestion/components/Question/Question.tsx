import { Separator } from '@/components/ui/separator'
import { EyeIcon } from '@/icons'
import { Question as QuestionType } from '@/types/question.type'

interface Props {
  question: QuestionType
}

export default function Question({ question }: Props) {
  return (
    <div>
      <div className='px-4 py-3 rounded-lg shadow-md bg-white mb-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center mb-2'>
            <img
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8LrGjiUDcvYjUMk7jUJJZo0kK4Y4NzKxmQ&s'
              alt='avatar'
              className='size-14 mr-2 rounded-full'
            />
            <div>
              <div className='font-bold mr-2'>
                {question.askerFirstname} {question.askerLastname}
              </div>
              <div className='text-xs text-gray-400'>{question.createdAt}</div>
            </div>
          </div>
          <div className='flex items-center'>
            <EyeIcon />
            <span className='ml-1 font-bold text-sm'>{question.views}</span>
          </div>
        </div>
        <div className='px-2'>
          <div className='text-blue-600 font-semibold'>#{question.department.name}</div>
          <div className='mb-3 text-blue-600 font-semibold'>#{question.field.name}</div>
          <div className='font-semibold text-sm'>{question.title}</div>
          <div>{question.content}</div>
        </div>
        <Separator className='my-4' />
        <div>
          <div className='flex'>
            <img
              src='https://png.pngtree.com/png-clipart/20190924/original/pngtree-vector-user-young-boy-avatar-icon-png-image_4827810.jpg'
              alt='avatar'
              className='size-12 mr-2 rounded-full'
            />
            <div>
              <div className='rounded-md bg-[#f0f2f5] px-4 py-2'>
                <div className='font-bold text-sm'>
                  {question.answerUserFirstname} {question.answerUserLastname}
                </div>
                <div>{question.answerContent}</div>
              </div>
              <div className='text-xs text-gray-400'>{question.answerCreatedAt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
