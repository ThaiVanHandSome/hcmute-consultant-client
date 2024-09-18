import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface CheckboxCustomProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
}

export default function CheckboxCustom<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  className = 'mb-3'
}: CheckboxCustomProps<TFieldValues>) {
  const { field } = useController({ name, control })
  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className='flex items-center'>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className='!mt-0 ml-1'>{label}</FormLabel>
          </FormItem>
        )}
      />
    </div>
  )
}
