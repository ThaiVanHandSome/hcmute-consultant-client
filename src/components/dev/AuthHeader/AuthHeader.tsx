import LogoHCMUTE from '@/assets/images/logos/logo_hcmute.png'

export default function AuthHeader() {
  return (
    <header className='w-full shadow-lg py-2 px-12 flex items-center justify-between fixed top-0 left-0 z-30 bg-white h-header-height'>
      <div className='flex items-center'>
        <img src={LogoHCMUTE} alt='logo-hcmute' className='size-16' />
        <div className='font-bold text-primary ml-6'>
          TƯ VẤN VÀ HỖ TRỢ SINH VIÊN TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT THÀNH PHỐ HỒ CHÍ MINH
        </div>
      </div>
    </header>
  )
}
