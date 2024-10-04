import { getCommonQuestion } from '@/apis/question.api'
import { useQuery } from '@tanstack/react-query'

export default function QuestionLibrary() {
  const { data: commonQuestions } = useQuery({
    queryKey: ['common-question'],
    queryFn: getCommonQuestion
  })

  return (
    <div className='min-h-screen py-6'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center'>
          <div className='w-full md:w-3/4 lg:w-2/3 bg-background mt-4 px-8 py-6 rounded-lg shadow-2xl'>
            <h1 className='font-extrabold text-3xl text-center uppercase mb-10 text-primary tracking-wide'>
              Câu hỏi chung
            </h1>
            <div className='space-y-8'>
              {commonQuestions?.data.data?.content.map((question) => (
                <div
                  key={question.id}
                  className=' p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border'
                >
                  <h2 className='font-semibold text-xl text-indigo-600 mb-4'>{question.content}</h2>
                  <p className='text-card-foreground leading-relaxed'>{question.answerContent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
