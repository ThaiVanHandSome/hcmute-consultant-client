import { useEffect, useRef, useState } from 'react'
import ColorThief from 'colorthief'
import { Question } from '@/types/question.type'

interface Props {
  readonly question: Question
}

export default function QuestionContent({ question }: Props) {
  const [dominantColor, setDominantColor] = useState<string | null>(null)
  const [imgSizeStyle, setImgSizeStyle] = useState<string>('80%')
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (question.fileName.includes('http')) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = question.fileName

      img.onload = () => {
        const colorThief = new ColorThief()
        const dominantColor = colorThief.getColor(img)
        setDominantColor(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`)

        // Sau khi ảnh được tải, ta kiểm tra kích thước block và kích thước ảnh
        if (imgRef.current && containerRef.current) {
          const imgWidth = imgRef.current.naturalWidth
          const containerWidth = containerRef.current.offsetWidth

          if (imgWidth > containerWidth) {
            setImgSizeStyle('100%') // Nếu ảnh lớn hơn block, đặt kích thước 100% block
          } else if (imgWidth < containerWidth * 0.8) {
            setImgSizeStyle('80%') // Nếu ảnh nhỏ hơn 80% block, đặt kích thước 80% block
          }
        }
      }
    }
  }, [question.fileName])

  return (
    <div className='-mx-4'>
      <div className='px-4'>
        <div className='text-blue-600 font-semibold text-sm'>#{question.department.name}</div>
        <div className='mb-3 text-blue-600 font-semibold text-sm'>#{question.field.name}</div>
        <div className='font-semibold text-md italic mb-2'>🎯 {question.title}</div>
        <div dangerouslySetInnerHTML={{ __html: question.content }} className='mb-4'></div>
      </div>
      {question.fileName.includes('http') && (
        <div
          className='flex items-center justify-center rounded-md'
          ref={containerRef} // Tham chiếu đến block chứa ảnh
          style={{ backgroundColor: dominantColor ?? 'white' }}
        >
          <img
            ref={imgRef} // Tham chiếu đến ảnh
            src={question.fileName}
            alt='content-bg'
            style={{ width: imgSizeStyle, height: 'auto' }} // Điều chỉnh kích thước ảnh
          />
        </div>
      )}
    </div>
  )
}
