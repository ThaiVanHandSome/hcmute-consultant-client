import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface InputCustomProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
}

export default function InputCustom<TFieldValues extends FieldValues>({
  name,
  placeholder,
  label,
  type = 'text',
  control,
  disabled,
  className = 'mb-3'
}: InputCustomProps<TFieldValues>) {
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
              <Input disabled={disabled} type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
