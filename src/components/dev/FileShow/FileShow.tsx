import FileItem from '@/components/dev/FileItem'
import QuestionImage from '@/components/dev/QuestionImage'
import { isImageFile } from '@/utils/utils'
import clsx from 'clsx'

interface Props {
  readonly url: string
  readonly className?: string
}

export default function FileShow({ url, className }: Props) {
  const classNames = clsx('w-56', className)
  if (!url) return <></>
  return <div className={classNames}>{isImageFile(url) ? <QuestionImage url={url} /> : <FileItem url={url} />}</div>
}
