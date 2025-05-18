import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import React from 'react'

interface Props {
  readonly Label: React.ReactNode
  readonly Items: React.ReactNode
  readonly className?: string
  readonly showSeparator?: boolean
}

export default function FormPartContainer({ Label, Items, className, showSeparator = false }: Props) {
  return (
    <div className={cn('group rounded-lg transition-all duration-200', className)}>
      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-12 md:col-span-4 space-y-1'>{Label}</div>
        <div className='col-span-12 md:col-span-8'>{Items}</div>
      </div>
      {showSeparator && <Separator className='mt-6 mb-4' />}
    </div>
  )
}
