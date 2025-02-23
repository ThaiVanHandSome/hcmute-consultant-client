import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import './SuccessDialog.scss'

interface SuccessDialogProps {
  message: string
  onClose: () => void
  navigateTo: string
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ message, onClose, navigateTo }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-96 relative'>
        <div className='progress-bar'></div>
        <div className='flex items-center justify-center mb-4'>
          <CheckCircle className='text-green-500 text-6xl' />
        </div>
        <p className='text-center text-lg font-semibold mb-4'>{message}</p>
        <div className='flex justify-end space-x-2'>
          <Button size='sm' variant='secondary' onClick={onClose}>
            Đóng
          </Button>
          <Button size='sm' onClick={() => navigate(navigateTo)}>
            Đi đến trang
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessDialog
