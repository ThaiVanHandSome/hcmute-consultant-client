import { getAllQuestion } from '@/apis/question.api'
import useQueryParams from '@/hooks/useQueryParams'
import Question from '@/pages/Home/components/ListQuestion/components/Question'
import { QuestionListConfig } from '@/types/question.type'
import { useQuery } from '@tanstack/react-query'

export type QueryConfig = {
  [key in keyof QuestionListConfig]: string
}

export default function ListQuestion() {
  const queryParams = useQueryParams() as Partial<QueryConfig>
  const queryConfig: QueryConfig = {
    page: queryParams.page ?? '0',
    size: queryParams.size ?? '10',
    sortBy: queryParams.sortBy ?? 'title',
    sortDir: queryParams.sortDir ?? 'asc'
  }

  const { data: questions } = useQuery({
    queryKey: ['questions'],
    queryFn: () => getAllQuestion(queryConfig)
  })

  return (
    <div>
      <div>{questions?.data.data.content.map((question) => <Question key={question.title} question={question} />)}</div>
    </div>
  )
}
