import * as React from 'react'

import { cn } from '@/lib/utils'
import { EyeIcon, EyeSlashIcon } from '@/icons'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [currType, setCurrType] = React.useState(type)
  const handleChangeType = () => {
    if (currType === 'text') setCurrType('password')
    else setCurrType('text')
  }
  return (
    <div className='relative'>
      <input
        type={currType}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
      <div
        aria-hidden='true'
        className='absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer'
        onClick={handleChangeType}
      >
        {type === 'password' && currType === 'password' && <EyeIcon className='size-5' />}
        {type === 'password' && currType === 'text' && <EyeSlashIcon className='size-5' />}
      </div>
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
