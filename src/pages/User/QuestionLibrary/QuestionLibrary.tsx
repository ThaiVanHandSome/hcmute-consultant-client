import { getCommonQuestion } from '@/apis/question.api'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useQuery } from '@tanstack/react-query'

export default function QuestionLibrary() {
  const { data: commonQuestions } = useQuery({
    queryKey: ['common-question'],
    queryFn: getCommonQuestion
  })
  return (
    <div className='bg-primary-bg'>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-2/3 bg-background text-foreground mt-4 px-6 py-2 rounded-lg shadow-lg'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Câu hỏi chung</h1>
            {commonQuestions?.data.data?.content.map((question) => (
              <Accordion key={question.id} type='single' collapsible>
                <AccordionItem value='item-1'>
                  <AccordionTrigger>{question.content}</AccordionTrigger>
                  <AccordionContent>{question.answerContent}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
