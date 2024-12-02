import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'

interface Props {
  readonly date: Date | undefined
  readonly setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  readonly placeholder?: string
  readonly label?: string
  readonly disabled?: boolean
}

export default function DatePicker({ date, setDate, placeholder, label, disabled }: Props) {
  return (
    <div className='flex flex-col space-y-2'>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
              label && 'mt-2'
            )}
            disabled={disabled}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'yyyy-MM-dd') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar mode='single' selected={date} onSelect={setDate} initialFocus disabled={disabled} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
