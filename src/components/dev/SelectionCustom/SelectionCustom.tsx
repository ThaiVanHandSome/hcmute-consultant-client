import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControlItem } from '@/types/utils.type'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SelectionCustomProps<TFieldValues extends FieldValues = FieldValues> {
  placeholder?: string
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  className?: string
  data?: FormControlItem[]
  defaultValue?: string
}

export default function SelectionCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className,
  placeholder,
  data,
  defaultValue
}: SelectionCustomProps<TFieldValues>) {
  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
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
