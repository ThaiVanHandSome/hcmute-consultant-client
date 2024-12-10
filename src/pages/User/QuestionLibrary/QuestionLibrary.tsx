import { useState } from 'react'
import { getCommonQuestion } from '@/apis/question.api'
import FileShow from '@/components/dev/FileShow'
import { Label } from '@/components/ui/label'
import { useQuery } from '@tanstack/react-query'

export default function QuestionLibrary() {
  const { data: commonQuestions } = useQuery({
    queryKey: ['common-question'],
    queryFn: getCommonQuestion
  })

  // State to track which question is expanded
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null)

  const handleToggleQuestion = (questionId: number) => {
    // Toggle the question visibility
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId)
  }

  return (
    <div className='min-h-screen py-6'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center'>
          <div className='w-full md:w-3/4 lg:w-2/3 bg-background mt-4 px-8 py-6 rounded-lg shadow-xl border'>
            <h1 className='font-extrabold text-3xl text-center uppercase mb-10 text-primary tracking-wide'>
              Câu hỏi chung
            </h1>
            <div className='space-y-8'>
              {commonQuestions?.data.data?.content.map((question) => (
                <div
                  key={question.commonQuestionId}
                  className='space-y-4 mt-4 px-4 py-2 border rounded-md shadow-md'
                >
                  <p
                    className='text-lg font-medium text-foreground cursor-pointer'
                    onClick={() => handleToggleQuestion(question.commonQuestionId)}
                  >
                    {question.title}
                  </p>
                  {/* Show content only if the question is expanded */}
                  {expandedQuestionId === question.commonQuestionId && (
                    <div>
                      <div
                        className='text-foreground leading-relaxed'
                        dangerouslySetInnerHTML={{ __html: question.content }}
                      ></div>

                      <FileShow url={question.file} />

                      <div className='mt-6'>
                        <blockquote className='border-l-4 border-gray-300 pl-4 italic text-foreground bg-background rounded-md p-4'>
                          <Label className='text-sm font-semibold mb-3'>Câu trả lời</Label>
                          <p className='text-lg font-medium text-foreground'>{question.answerTitle}</p>
                          <div dangerouslySetInnerHTML={{ __html: question.answerContent }}></div>
                          <FileShow url={question.fileAnswer} />
                        </blockquote>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
