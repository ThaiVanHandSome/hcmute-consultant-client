import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'

import { createRating, getRatingById } from '@/apis/consultant.api'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import EvaluationChooseConsultant from '@/pages/User/ConsultantEvaluation/components/EvaluationChooseConsultant'
import EvaluationForm from '@/pages/User/ConsultantEvaluation/components/EvaluationForm'
import { RatingSchema } from '@/utils/rules'
import useQueryParams from '@/hooks/useQueryParams'
import { useEffect, useRef } from 'react'

export type RatingFormData = yup.InferType<typeof RatingSchema>

export default function ConsultantEvaluation() {
  const { id } = useQueryParams()
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

  const { data: userRating } = useQuery({
    queryKey: ['user-rating', id],
    queryFn: () => getRatingById(id),
    enabled: !!id
  })
  const isViewed = !!userRating
  const isFormReset = useRef<boolean>(!isViewed)

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

  useEffect(() => {
    if (!userRating) return
    const data = userRating.data.data
    form.reset({
      consultantId: String(data.consultant.id),
      departmentId: String(data.department.id),
      generalSatisfaction: String(data.generalSatisfaction),
      generalComment: data.generalComment,
      expertiseKnowledge: String(data.expertiseKnowledge),
      expertiseComment: data.expertiseComment,
      attitude: String(data.attitude),
      attitudeComment: data.attitudeComment,
      responseSpeed: String(data.responseSpeed),
      responseSpeedComment: data.responseSpeedComment,
      understanding: String(data.understanding),
      understandingComment: data.understandingComment
    })
    console.log(form.watch())

    isFormReset.current = true
  }, [userRating])

  return (
    <div>
      {isFormReset && (
        <div className='bg-primary-bg'>
          <div className='container'>
            <div className='flex justify-center'>
              <div className='w-3/4 bg-background text-foreground px-6 py-2 rounded-lg shadow-lg mt-6 border'>
                <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>
                  {!isViewed ? 'Đánh giá ban tư vấn' : 'Kết quả đánh giá'}
                </h1>
                <Form {...form}>
                  <EvaluationChooseConsultant form={form} isViewed={isViewed} />
                  <form onSubmit={onSubmit}>
                    <Separator className='mt-8 mb-4 col-span-12' />
                    <EvaluationForm form={form} isViewed={isViewed} />
                    {!isViewed && (
                      <Button
                        isLoading={createRatingMutation.isPending}
                        disabled={createRatingMutation.isPending}
                        className='px-6 py-2'
                      >
                        Gửi kết quả
                      </Button>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
