import { Separator } from '@/components/ui/separator'
import { RatingFormData } from '@/pages/User/ConsultantEvaluation/ConsultantEvaluation'
import Evaluation from '@/pages/User/ConsultantEvaluation/components/Evaluation'
import { UseFormReturn } from 'react-hook-form'

interface Props {
  readonly form: UseFormReturn<RatingFormData>
  readonly isViewed?: boolean
}

export default function EvaluationForm({ form, isViewed = false }: Props) {
  return (
    <div className='grid grid-cols-12 mt-8 text-left text-sm'>
      <div className='col-span-12 grid grid-cols-12 text-center'>
        <div className='col-span-2'></div>
        <div className='col-span-2 font-bold text-destructive'>😞 Rất không hài lòng</div>
        <div className='col-span-2 font-bold text-yellow-500'>😔 Không hài lòng</div>
        <div className='col-span-2 font-bold text-cyan-400'>😐 Bình thường</div>
        <div className='col-span-2 font-bold text-purple-800'>😊 Hài lòng</div>
        <div className='col-span-2 font-bold text-green-700'>😄 Rất hài lòng</div>
      </div>
      <Separator className='my-4 col-span-12' />
      <Evaluation
        control={form.control}
        radioName='generalSatisfaction'
        inputName='generalComment'
        title='Mức độ hài lòng chung'
        isViewed={isViewed}
      />
      <Evaluation
        control={form.control}
        radioName='expertiseKnowledge'
        inputName='expertiseComment'
        title='Kiến thức chuyên môn'
        isViewed={isViewed}
      />
      <Evaluation
        control={form.control}
        radioName='attitude'
        inputName='attitudeComment'
        title='Thái độ'
        isViewed={isViewed}
      />
      <Evaluation
        control={form.control}
        radioName='responseSpeed'
        inputName='responseSpeedComment'
        title='Tốc độ phản hồi'
        isViewed={isViewed}
      />
      <Evaluation
        control={form.control}
        radioName='understanding'
        inputName='understandingComment'
        title='Sự dễ hiểu và chính xác'
        isViewed={isViewed}
      />
    </div>
  )
}
