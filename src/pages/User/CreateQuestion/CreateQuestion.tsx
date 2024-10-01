import QuestionForm from '@/components/dev/QuestionForm'

export default function CreateQuestion() {
  return (
    <div className='py-6'>
      <div className='container'>
        <div className='flex justify-center '>
          <div className='w-2/3 bg-white px-6 py-3 shadow-lg rounded-lg'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Đặt câu hỏi cho ban tư vấn</h1>
            <div>
              <QuestionForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
