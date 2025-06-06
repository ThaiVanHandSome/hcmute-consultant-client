import { getQuestions } from '@/apis/question.api'
import ExportCustom from '@/components/dev/ExportCustom'
import ImportCustom from '@/components/dev/ImportCustom'
import PaginationCustom from '@/components/dev/PaginationCustom'
import QuestionFilter from '@/components/dev/QuestionFilter'
import QuestionItem from '@/components/dev/QuestionItem'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useQuestionQueryConfig from '@/hooks/useQuestionQueryConfig'
import { useQuery } from '@tanstack/react-query'

export default function ManageQuestion() {
  const questionQueryConfig = useQuestionQueryConfig()
  if (questionQueryConfig.status === 'APPROVED') {
    questionQueryConfig.statusApproval = 'true'
  }

  const { data: questions } = useQuery({
    queryKey: ['questions', questionQueryConfig],
    queryFn: () => getQuestions(questionQueryConfig)
  })
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-semibold text-lg'>Câu hỏi</h1>
          <p className='text-sm italic'>Quản lý câu hỏi</p>
        </div>
        <div>
          <ExportCustom dataType='question' queryConfig={questionQueryConfig} /> <ImportCustom />
        </div>
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
