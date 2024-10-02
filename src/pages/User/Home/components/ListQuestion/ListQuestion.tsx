import { getAllQuestion } from '@/apis/question.api'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { QuestionCircle, Spinner } from '@/icons'
import Question from '@/components/dev/Question'
import { Question as QuestionType } from '@/types/question.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import path from '@/constants/path'

export default function ListQuestion() {
  const initialQuestionQueryConfig: QuestionQueryConfig = useQuestionQueryConfig()
  const [listQuestion, setListQuestion] = useState<QuestionType[]>([])
  const [questionQueryConfig, setQuestionQueryConfig] = useState(initialQuestionQueryConfig)

  const {
    data: questions,
    isLoading,
    isFetching,
    isError
  } = useQuery({
    queryKey: ['questions', questionQueryConfig],
    queryFn: () => getAllQuestion(questionQueryConfig),
    refetchOnMount: true
  })

  // when user scroll to end page => fetch question with next page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight) {
        setQuestionQueryConfig((prev) => ({
          ...prev,
          page: String(parseInt(prev.page) + 1)
        }))
      }
    }

    if (!isFetching && !isError) window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFetching, isError])

  // if user choose one of departments => reset list question and set new question query config
  const json = JSON.stringify(initialQuestionQueryConfig)
  useEffect(() => {
    setListQuestion([])
    setQuestionQueryConfig(initialQuestionQueryConfig)
  }, [json])

  const questionJson = JSON.stringify(questions)

  // add new question fetched to state list question
  useEffect(() => {
    if (questions?.data.data.content) {
      setListQuestion((prev) => [...prev, ...questions.data.data.content])
    }
  }, [questionJson])

  return (
    <div>
      <div className='px-6 py-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 text-white mb-6 flex justify-between items-center'>
        <div className='flex'>
          <QuestionCircle className='text-3xl text-white mb-4 animate-bounce size-9 mr-2' />
          <div>
            <p className='text-xl font-semibold mb-2'>Bạn cần ban tư vấn hỗ trợ</p>
            <p className='text-md mb-4'>Hãy đặt câu hỏi ngay nhé</p>
          </div>
        </div>
        <Link to={path.createQuestion}>
          <Button className='bg-[#054bb4] text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300'>
            Đặt câu hỏi
          </Button>
        </Link>
      </div>

      <div>
        {listQuestion.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </div>
      <div className='mt-4 flex items-center justify-center'>{isLoading && <Spinner />}</div>
    </div>
  )
}
