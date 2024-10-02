import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues, Path, PathValue, useController } from 'react-hook-form'

interface SelectionCustomProps<TFieldValues extends FieldValues = FieldValues> {
  readonly placeholder?: string
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly data?: FormControlItem[]
  readonly defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
  readonly disabled?: boolean
  readonly onFocus?: () => void
}

export default function SelectionCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className,
  placeholder,
  label,
  data,
  defaultValue,
  disabled = false,
  onFocus
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
            {label && <FormLabel>{label}</FormLabel>}
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              value={field.value ? String(field.value) : undefined}
            >
              <FormControl>
                <SelectTrigger onFocus={onFocus}>
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
