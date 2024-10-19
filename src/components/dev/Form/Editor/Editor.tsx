import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import ReactQuill from 'react-quill'

interface EditorProps<TFieldValues extends FieldValues = FieldValues> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly disabled?: boolean
}

export default function Editor<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  className = 'mb-3',
  disabled = false
}: EditorProps<TFieldValues>) {
  const { field } = useController({ name, control })

  return (
    <div className={className}>
      <Label className='ml-1 mb-2'>{label}</Label>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <FormControl>
              <ReactQuill
                theme='snow'
                value={field.value}
                onChange={field.onChange}
                className='bg-background text-foreground'
                readOnly={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
