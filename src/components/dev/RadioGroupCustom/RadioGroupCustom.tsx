import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface RadioGroupCustomProps<TFieldValues extends FieldValues = FieldValues> {
  label?: string
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  className?: string
  data?: FormControlItem[]
  defaultValue?: string
}

export default function RadioGroupCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className = 'mb-4',
  label,
  data,
  defaultValue
}: RadioGroupCustomProps<TFieldValues>) {
  const { field } = useController({ name, control })
  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={defaultValue} className='flex items-center'>
                {data?.map(({ value, label }) => (
                  <FormItem className='flex items-center'>
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className='!mt-0 ml-1'>{label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
