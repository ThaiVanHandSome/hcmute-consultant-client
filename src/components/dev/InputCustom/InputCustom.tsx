import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface InputCustomProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
}

export default function InputCustom<TFieldValues extends FieldValues>({
  name,
  placeholder,
  label,
  type = 'text',
  control,
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
              <Input type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
