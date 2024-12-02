import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

interface EditorProps<TFieldValues extends FieldValues = FieldValues> {
  readonly label?: string
  readonly control: Control<TFieldValues>
  readonly name: FieldPath<TFieldValues>
  readonly className?: string
  readonly disabled?: boolean
  readonly helperText?: string
  readonly isRequired?: boolean
  readonly infoText?: string
}

export default function Editor<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  className = 'mb-3',
  disabled = false,
  helperText,
  infoText,
  isRequired = false
}: EditorProps<TFieldValues>) {
  const { field } = useController({ name, control })

  return (
    <div className={className}>
      {label && (
        <div className='flex items-center space-x-1 mb-2'>
          <Label>{label}</Label>
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
                <TooltipTrigger>
                  <InfoIcon className='size-3 text-primary' strokeWidth={1.25} />
                </TooltipTrigger>
                <TooltipContent className='bg-primary text-primary-foreground'>{infoText}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
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
            {helperText && <FormDescription className='text-xs'>{helperText}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
