import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ClockIcon } from '@radix-ui/react-icons'
import TimePicker from 'react-time-picker'

interface Props {
  readonly time: string | undefined
  readonly setTime: React.Dispatch<React.SetStateAction<string | undefined>>
  readonly placeholder?: string
  readonly label?: string
  readonly disabled?: boolean
}

export default function TimePickerCustom({ time, setTime, placeholder, label, disabled }: Props) {
  const handleTimeChange = (value: string | null) => {
    if (!disabled) {
      setTime(value ?? undefined)
    }
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !time && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
              label && 'mt-2'
            )}
            disabled={disabled}
          >
            <ClockIcon className='mr-2 h-4 w-4' />
            {time ? time : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <div className='p-2'>
            <TimePicker
              onChange={handleTimeChange}
              value={time}
              disableClock
              clearIcon={null}
              format='HH:mm'
              disabled={disabled}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
