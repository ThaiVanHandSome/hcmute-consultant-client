import InputCustom from '@/components/dev/Form/InputCustom'
import RadioGroupCustom from '@/components/dev/Form/RadioGroupCustom'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface EvaluationProps<TFieldValues extends FieldValues = FieldValues> {
  readonly title?: string
  readonly control: Control<TFieldValues>
  readonly radioName: FieldPath<TFieldValues>
  readonly inputName: FieldPath<TFieldValues>
  readonly className?: string
  readonly isViewed?: boolean
}

export default function Evaluation<TFieldValues extends FieldValues>({
  radioName,
  inputName,
  control,
  title,
  className = 'col-span-12 grid grid-cols-12 mb-5',
  isViewed = false
}: EvaluationProps<TFieldValues>) {
  const dataRadioGroup: FormControlItem[] = Array(5)
    .fill(0)
    .map((_, index) => {
      return {
        value: String(index + 1),
        label: ''
      }
    })
  return (
    <div className={className}>
      <div className='col-span-12 grid grid-cols-12 py-2'>
        <div className='col-span-2 font-semibold'>{title}</div>
        <div className='col-span-10 w-full space-y-0'>
          <RadioGroupCustom
            className='w-full'
            name={radioName}
            control={control}
            data={dataRadioGroup}
            radioClassName='w-[20%] flex items-center justify-center'
            disabled={isViewed}
          />
        </div>
      </div>
      <div className='col-span-12 grid grid-cols-12 mt-3 py-2 border-b border-gray-300'>
        <div className='col-span-2 flex items-center italic'>Nhận xét</div>
        <div className='col-span-10'>
          <InputCustom
            disabled={isViewed}
            name={inputName}
            control={control}
            placeholder='Nhận xét'
            className='w-full'
          />
        </div>
      </div>
    </div>
  )
}
