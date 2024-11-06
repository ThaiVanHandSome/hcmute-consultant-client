import { getQuestions } from '@/apis/question.api'
import PaginationCustom from '@/components/dev/PaginationCustom'
import QuestionFilter from '@/components/dev/QuestionFilter'
import QuestionItem from '@/components/dev/QuestionItem'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useQuestionQueryConfig from '@/hooks/useQuestionQueryConfig'
import { useQuery } from '@tanstack/react-query'

export default function ManageQuestion() {
  const questionQueryConfig = useQuestionQueryConfig()

  const { data: questions } = useQuery({
    queryKey: ['questions', questionQueryConfig],
    queryFn: () => getQuestions(questionQueryConfig)
  })
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-semibold text-lg'>Câu hỏi</h1>
        <p className='text-sm italic'>Quản lý câu hỏi</p>
      </div>
      <div>
        <QuestionFilter queryConfig={questionQueryConfig} path={path.manageQuestion} />
      </div>
      <Separator />
      <div className='rounded-md shadow-lg bg-background'>
        {questions?.data.data.content.map((question) => <QuestionItem key={question.id} question={question} />)}
      </div>
      <PaginationCustom
        path={path.manageQuestion}
        queryConfig={questionQueryConfig}
        pageSize={questions?.data.data.totalPages as number}
      />
    </div>
  )
}
