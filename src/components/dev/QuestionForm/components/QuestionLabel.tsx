import { Label } from '@/components/ui/label'

interface Props {
  readonly title: string
  readonly subtitle?: string
}

export default function QuestionLabel({ title, subtitle }: Props) {
  return (
    <div>
      <Label className='text-md relative'>{title}</Label>
      {subtitle && <div className='text-xs text-gray-400'>{subtitle}</div>}
    </div>
  )
}
