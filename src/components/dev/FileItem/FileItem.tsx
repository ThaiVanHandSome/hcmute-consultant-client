import { FileIcon } from '@radix-ui/react-icons'

interface Props {
  readonly url: string
}

export default function FileItem({ url }: Props) {
  const fileName = url.split('/').pop()

  return (
    <a href={url} download={fileName} className='inline-block px-3 py-1 border rounded-lg shadow-md mt-2 bg-primary-bg'>
      <div className='flex items-center space-x-3'>
        <div className='flex items-center justify-center w-10 h-10 bg-foreground rounded-full'>
          <FileIcon className='text-background w-6 h-6' />
        </div>
        <p className='text-foreground font-medium'>{fileName ?? 'Download file'}</p>
      </div>
    </a>
  )
}
