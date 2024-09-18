import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues, Path, PathValue, useController } from 'react-hook-form'

interface RadioGroupCustomProps<TFieldValues extends FieldValues = FieldValues> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly data?: FormControlItem[]
  readonly defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
}

export default function RadioGroupCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className = 'mb-4',
  label,
  data,
  defaultValue
}: RadioGroupCustomProps<TFieldValues>) {
  const { field } = useController({ name, control, defaultValue })

  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value || ''} className='flex items-center'>
                {data?.map(({ value, label }) => (
                  <FormItem key={value} className='flex items-center'>
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
