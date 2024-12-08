import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

interface InputCustomProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly classNameInput?: string
  readonly helperText?: string
  readonly isRequired?: boolean
  readonly infoText?: string
}

export default function InputCustom<TFieldValues extends FieldValues>({
  name,
  placeholder,
  label,
  type = 'text',
  control,
  disabled,
  readOnly,
  className = 'mb-3',
  classNameInput = '',
  helperText,
  infoText,
  isRequired = false,
  onFocus
}: InputCustomProps<TFieldValues>) {
  const { field } = useController({ name, control })

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
            <FormControl>
              <Input
                readOnly={readOnly}
                onFocus={onFocus}
                className={classNameInput}
                disabled={disabled}
                type={type}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            {helperText && <FormDescription className='text-xs'>{helperText}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
