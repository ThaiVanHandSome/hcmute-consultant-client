import { getConsultantsByDepartment } from '@/apis/consultant.api'
import { getAllDepartments } from '@/apis/department.api'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { RatingFormData } from '@/pages/User/ConsultantEvaluation/ConsultantEvaluation'
import { Consultant } from '@/types/consultant.type'
import { FormControlItem } from '@/types/utils.type'
import { generateSelectionData } from '@/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface Props {
  readonly form: UseFormReturn<RatingFormData>
  readonly isDisabledSelection?: boolean
}

export default function EvaluationChooseConsultant({ form, isDisabledSelection = false }: Props) {
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  // generate selection data from departments to use in selection component
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

  // generate selection data from departments to use in selection component
  const consultantsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = consultants?.data.data
    return data?.map((consultant: Consultant) => {
      return {
        value: String(consultant.id),
        label: consultant.lastName + ' ' + consultant.firstName
      }
    })
  }, [consultants])

  return (
    <div className='grid grid-cols-2 gap-4'>
      <div className='col-span-1'>
        <SelectionCustom
          control={form.control}
          name='departmentId'
          placeholder='Chọn phòng ban'
          data={departmentsSelectionData}
          disabled={isDisabledSelection}
        />
      </div>
      <div className='col-span-1'>
        <SelectionCustom
          control={form.control}
          name='consultantId'
          placeholder='Chọn tư vấn viên'
          data={consultantsSelectionData}
          disabled={isDisabledSelection}
        />
      </div>
    </div>
  )
}
