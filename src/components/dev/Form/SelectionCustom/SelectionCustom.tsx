import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControlItem } from '@/types/utils.type'
import { InfoIcon } from 'lucide-react'
import { Control, FieldPath, FieldValues, Path, PathValue, useController } from 'react-hook-form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SelectionCustomProps<TFieldValues extends FieldValues = FieldValues> {
  readonly placeholder?: string
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly classNameSelection?: string
  readonly data?: FormControlItem[]
  readonly defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>
  readonly disabled?: boolean
  readonly onFocus?: () => void
  readonly helperText?: string
  readonly isRequired?: boolean
  readonly infoText?: string
}

export default function SelectionCustom<TFieldValues extends FieldValues>({
  name,
  control,
  className,
  classNameSelection = 'max-h-[30vh]',
  placeholder,
  label,
  data,
  defaultValue,
  disabled = false,
  helperText,
  infoText,
  isRequired = false,
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
            {label && (
              <div className='flex items-center space-x-1'>
                <FormLabel>{label}</FormLabel>
                {isRequired && (
                  <span
                    className='font-semibold text-destructive'
                    style={{
                      lineHeight: 0
                    }}
                  >
                    *
                  </span>
                )}
                {infoText && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type='button'>
                        <InfoIcon className='size-3 text-primary' strokeWidth={1.25} />
                      </TooltipTrigger>
                      <TooltipContent className='bg-primary text-primary-foreground'>{infoText}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
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
              <SelectContent className={classNameSelection}>
                {data?.map((item) => (
                  <SelectItem key={item.value} value={String(item.value)}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {helperText && <FormDescription className='text-xs'>{helperText}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
