import { Label } from '@/components/ui/label'

interface Props {
  readonly title: string
  readonly subtitle?: string
  readonly icon?: React.ReactNode
}

export default function QuestionLabel({ title, subtitle, icon }: Props) {
  return (
    <div className='flex gap-2 items-start'>
      {icon}
      <div>
        <Label className='text-md relative'>{title}</Label>
        {subtitle && <div className='text-xs text-gray-400'>{subtitle}</div>}
      </div>
    </div>
  )
}
