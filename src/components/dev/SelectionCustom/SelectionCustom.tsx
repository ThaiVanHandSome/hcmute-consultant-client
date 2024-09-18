import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues, Path, PathValue, useController } from 'react-hook-form'

interface SelectionCustomProps<TFieldValues extends FieldValues = FieldValues> {
  readonly placeholder?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly data?: FormControlItem[]
  readonly defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
}

export default function SelectionCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className,
  placeholder,
  data,
  defaultValue
}: SelectionCustomProps<TFieldValues>) {
  const { field } = useController({
    name,
    control,
    defaultValue
  })
  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={defaultValue}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data?.map((item) => (
                  <SelectItem key={item.value} value={String(item.value)}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
