import ColorThief from 'colorthief'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
  readonly url: string
}

export default function QuestionImage({ url }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [dominantColor, setDominantColor] = useState<string | null>(null)
  const [imgSizeStyle, setImgSizeStyle] = useState<string>('80%')
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url

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
  }, [url])
  return (
    <>
      <div
        aria-hidden='true'
        className='flex items-center justify-center rounded-md cursor-pointer'
        ref={containerRef} // Tham chiếu đến block chứa ảnh
        style={{ backgroundColor: dominantColor ?? 'white' }}
        onClick={() => setOpen(true)}
      >
        <img
          ref={imgRef} // Tham chiếu đến ảnh
          src={url}
          alt='content-bg'
          style={{ width: imgSizeStyle, height: 'auto' }} // Điều chỉnh kích thước ảnh
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-[900px] max-h-[80vh] overflow-x-auto'>
          <img src={url} alt='content-bg' className='w-full' />
        </DialogContent>
      </Dialog>
    </>
  )
}
