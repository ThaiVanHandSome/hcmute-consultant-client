import { useState, useEffect } from 'react'
import FileItem from '@/components/dev/FileItem'
import QuestionImage from '@/components/dev/QuestionImage'
import clsx from 'clsx'

interface Props {
  readonly url?: string
  readonly className?: string
}

export default function FileShow({ url, className }: Props) {
  const [fileType, setFileType] = useState<string | null>(null)
  const classNames = clsx(className)

  const checkFileType = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl)
      const contentType = response.headers.get('Content-Type')

      if (contentType) {
        if (contentType.includes('image')) {
          setFileType('image')
        } else {
          setFileType('file')
        }
      }
    } catch (error) {
      console.error('Error fetching file:', error)
    }
  }

  useEffect(() => {
    if (url) {
      checkFileType(url)
    }
  }, [url])

  if (!url) return <></>

  if (fileType === 'image') {
    return (
      <div className={classNames}>
        <QuestionImage url={url} />
      </div>
    )
  } else if (fileType === 'file') {
    return (
      <div className={classNames}>
        <FileItem url={url} />
      </div>
    )
  }
}
