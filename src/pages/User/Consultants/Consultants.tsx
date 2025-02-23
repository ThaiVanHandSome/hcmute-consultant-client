import { getAllConsultant } from '@/apis/consultant.api'
import DataTable from '@/components/dev/DataTable'
import PaginationCustom from '@/components/dev/PaginationCustom'
import path from '@/constants/path'
import useConsultantQueryConfig, { ConsultantQueryConfig } from '@/hooks/useConsultantQueryConfig'
import { columns } from '@/pages/User/Consultants/columns'
import ConsultantFilter from '@/pages/User/Consultants/components/ConsultantFilter'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { HiOutlineUsers, HiOutlineUserGroup, HiOutlineClock } from 'react-icons/hi'
import { Card } from '@/components/ui/card'

export default function Consultants() {
  const consultantQueryConfig: ConsultantQueryConfig = useConsultantQueryConfig()

  const { data: consultants } = useQuery({
    queryKey: ['consultant', consultantQueryConfig],
    queryFn: () => getAllConsultant(consultantQueryConfig)
  })

  return (
    <div className='min-h-screen bg-[#fafafa]'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
          <div className='flex items-center space-x-3 mb-2'>
            <HiOutlineUsers className='w-7 h-7 text-gray-700' />
            <h1 className='text-2xl font-medium text-gray-800'>Tư Vấn Viên</h1>
          </div>
          <p className='text-gray-500 text-sm'>Quản lý và theo dõi danh sách tư vấn viên của bạn</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <Card className='p-6 hover:shadow-lg transition-shadow duration-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Tổng số</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>
                    {consultants?.data.data.totalElements || 0}
                  </p>
                </div>
                <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                  <HiOutlineUserGroup className='w-6 h-6 text-gray-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow duration-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Đang hoạt động</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>0</p>
                </div>
                <div className='w-12 h-12 bg-green-50 rounded-full flex items-center justify-center'>
                  <HiOutlineUsers className='w-6 h-6 text-green-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6 hover:shadow-lg transition-shadow duration-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Chờ xác nhận</p>
                  <p className='text-2xl font-semibold text-gray-800 mt-1'>0</p>
                </div>
                <div className='w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center'>
                  <HiOutlineClock className='w-6 h-6 text-orange-600' />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Card */}
          <Card className='overflow-hidden border-0 shadow-sm'>
            {/* Filter Section */}
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-base font-medium text-gray-700 mb-4'>Bộ lọc tìm kiếm</h2>
              <div className='bg-gray-50 rounded-lg p-4'>
                <ConsultantFilter consultantQueryConfig={consultantQueryConfig} />
              </div>
            </div>

            {/* Table Section */}
            <div className='p-6'>
              <div className='rounded-lg overflow-hidden border border-gray-100'>
                {consultants?.data.data.content && (
                  <DataTable
                    data={consultants?.data.data.content}
                    columns={columns}
                    size={consultants.data.data.size}
                  />
                )}
              </div>

              {/* Pagination */}
              <div className='mt-6 flex justify-center'>
                <PaginationCustom
                  path={path.consultants}
                  queryConfig={consultantQueryConfig}
                  pageSize={consultants?.data.data.totalPages as number}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
