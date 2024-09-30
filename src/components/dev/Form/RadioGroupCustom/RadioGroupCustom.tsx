import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues, Path, PathValue, useController } from 'react-hook-form'

interface RadioGroupCustomProps<TFieldValues extends FieldValues = FieldValues> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly radioClassName?: string
  readonly data?: FormControlItem[]
  readonly defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
  readonly disabled?: boolean
}

export default function RadioGroupCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className = 'mb-4',
  radioClassName = 'flex items-center',
  label,
  data,
  defaultValue,
  disabled = false
}: RadioGroupCustomProps<TFieldValues>) {
  const { field } = useController({ name, control, defaultValue })

  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className='space-y-0'>
            <FormLabel className='mb-2 block'>{label}</FormLabel>
            <FormControl>
              <RadioGroup
                disabled={disabled}
                onValueChange={field.onChange}
                value={field.value || ''}
                className='flex items-center'
              >
                {data?.map(({ value, label }) => (
                  <FormItem key={value} className={radioClassName}>
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    {label && <FormLabel className='!mt-0 ml-1'>{label}</FormLabel>}
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
