import { Separator } from '@/components/ui/separator'
import React from 'react'

interface Props {
  readonly Label: React.ReactNode
  readonly Items: React.ReactNode
}

export default function FormPartContainer({ Label, Items }: Props) {
  return (
    <div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-4'>{Label}</div>
        <div className='col-span-8'>{Items}</div>
      </div>
      <Separator className='my-4' />
    </div>
  )
}
