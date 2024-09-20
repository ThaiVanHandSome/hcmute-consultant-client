import { createRating, getConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { toast } from '@/hooks/use-toast'
import Evaluation from '@/pages/User/ConsultantEvaluation/components/Evaluation'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { RatingSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

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

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const departmentId = form.watch('departmentId')
  const { data: consultants } = useQuery({
    queryKey: ['consultantsByDepartment', departmentId],
    queryFn: () => getConsultantsByDepartment(departmentId),
    enabled: !!departmentId
  })
  const consultantsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = consultants?.data.data
    return data?.map((consultant: Consultant) => {
      return {
        value: String(consultant.id),
        label: consultant.lastName + ' ' + consultant.firstName
      }
    })
  }, [consultants])

  const createRatingMutation = useMutation({
    mutationFn: (body: RatingFormData) => createRating(body)
  })

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

  // const consultantId = form.watch('consultantId')
  // const consultantChecked = useMemo(() => {
  //   if (!consultantId || !consultants) return null
  //   return consultants.data.data.find((c) => c.id === parseInt(consultantId))
  // }, [consultantId, consultants])
  // console.log(consultantChecked);

  return (
    <div>
      <div className='container'>
        <div className='flex justify-center'>
          <div className='w-3/4 bg-white px-6 py-2 rounded-lg shadow-lg mt-6'>
            <h1 className='font-bold text-2xl text-center uppercase mb-6 text-primary'>Đánh giá ban tư vấn</h1>
            {/* {consultantChecked && (
              <div>
                <div>
                  <img src={consultantChecked.avatarUrl} alt='avatar' />
                  <div>
                    <p>
                      Họ và tên: {consultantChecked.lastName} {consultantChecked.firstName}
                    </p>
                    <p>Khoa: {consultantChecked.department?.name}</p>
                    <p>Số điện thoại: {consultantChecked.phone}</p>
                  </div>
                </div>
              </div>
            )} */}
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-1'>
                    <SelectionCustom
                      control={form.control}
                      name='departmentId'
                      placeholder='Chọn phòng ban'
                      data={departmentsSelectionData}
                    />
                  </div>
                  <div className='col-span-1'>
                    <SelectionCustom
                      control={form.control}
                      name='consultantId'
                      placeholder='Chọn tư vấn viên'
                      data={consultantsSelectionData}
                    />
                  </div>
                </div>
                <Separator className='mt-8 mb-4 col-span-12' />
                <div className='grid grid-cols-12 mt-8 text-left text-sm'>
                  <div className='col-span-12 grid grid-cols-12 text-center'>
                    <div className='col-span-2'></div>
                    <div className='col-span-2 font-bold text-destructive'>1 = Rất không hài lòng</div>
                    <div className='col-span-2 font-bold text-yellow-500'>2 = Không hài lòng</div>
                    <div className='col-span-2 font-bold text-cyan-400'>3 = Bình thường</div>
                    <div className='col-span-2 font-bold text-purple-800'>4 = Hài lòng</div>
                    <div className='col-span-2 font-bold text-green-700'>5 = Rất hài lòng</div>
                  </div>
                  <Separator className='my-4 col-span-12' />
                  <Evaluation
                    control={form.control}
                    radioName='generalSatisfaction'
                    inputName='generalComment'
                    title='Mức độ hài lòng chung'
                  />
                  <Evaluation
                    control={form.control}
                    radioName='expertiseKnowledge'
                    inputName='expertiseComment'
                    title='Kiến thức chuyên môn'
                  />
                  <Evaluation control={form.control} radioName='attitude' inputName='attitudeComment' title='Thái độ' />
                  <Evaluation
                    control={form.control}
                    radioName='responseSpeed'
                    inputName='responseSpeedComment'
                    title='Tốc độ phản hồi'
                  />
                  <Evaluation
                    control={form.control}
                    radioName='understanding'
                    inputName='understandingComment'
                    title='Sự dễ hiểu và chính xác'
                  />
                </div>
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
