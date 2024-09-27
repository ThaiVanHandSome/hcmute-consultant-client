import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function QuestionLibrary() {
  return (
    <div>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-2/3 bg-white mt-4 px-6 py-2 rounded-lg shadow-lg'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Câu hỏi chung</h1>
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <Accordion type='single' collapsible>
                  <AccordionItem value='item-1'>
                    <AccordionTrigger>Câu hỏi mẫu?</AccordionTrigger>
                    <AccordionContent>Câu trả lời cho câu hỏi mẫu.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
