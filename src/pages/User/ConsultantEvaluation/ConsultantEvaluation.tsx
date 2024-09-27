import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'

import { createRating } from '@/apis/consultant.api'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import EvaluationChooseConsultant from '@/pages/User/ConsultantEvaluation/components/EvaluationChooseConsultant'
import EvaluationForm from '@/pages/User/ConsultantEvaluation/components/EvaluationForm'
import { RatingSchema } from '@/utils/rules'

export type RatingFormData = yup.InferType<typeof RatingSchema>

export default function ConsultantEvaluation() {
  const formDefaultValue: RatingFormData = {
    consultantId: '',
    departmentId: '',
    generalSatisfaction: '',
    generalComment: '',
    expertiseKnowledge: '',
    expertiseComment: '',
    attitude: '',
    attitudeComment: '',
    responseSpeed: '',
    responseSpeedComment: '',
    understanding: '',
    understandingComment: ''
  }
  const form = useForm<RatingFormData>({
    defaultValues: formDefaultValue,
    resolver: yupResolver(RatingSchema)
  })

  const navigate = useNavigate()

  const createRatingMutation = useMutation({
    mutationFn: (body: RatingFormData) => createRating(body)
  })

  // handle evaluation process
  const onSubmit = form.handleSubmit((values) => {
    createRatingMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          title: 'Thành công',
          description: res.data.message
        })
        navigate(path.home)
      }
    })
  })

  return (
    <div>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-3/4 bg-white px-6 py-2 rounded-lg shadow-lg mt-6'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Đánh giá ban tư vấn</h1>
            <Form {...form}>
              <EvaluationChooseConsultant form={form} />
              <form onSubmit={onSubmit}>
                <Separator className='mt-8 mb-4 col-span-12' />
                <EvaluationForm form={form} />
                <Button
                  isLoading={createRatingMutation.isPending}
                  disabled={createRatingMutation.isPending}
                  className='px-6 py-2'
                >
                  Gửi kết quả
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
