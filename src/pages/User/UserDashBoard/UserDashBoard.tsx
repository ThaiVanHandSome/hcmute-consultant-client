import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartData = [
  { month: 'January', question: 12, schedual: 2 },
  { month: 'February', question: 20, schedual: 1 },
  { month: 'March', question: 32, schedual: 5 },
  { month: 'April', question: 17, schedual: 2 },
  { month: 'May', question: 29, schedual: 7 },
  { month: 'June', question: 50, schedual: 2 },
  { month: 'July', question: 45, schedual: 9 },
  { month: 'August', question: 38, schedual: 8 },
  { month: 'September', question: 25, schedual: 2 },
  { month: 'October', question: 10, schedual: 2 },
  { month: 'November', question: 22, schedual: 3 },
  { month: 'December', question: 35, schedual: 2 }
]

const chartConfig = {
  question: {
    label: 'Số câu hỏi',
    color: '#2563eb'
  },
  schedual: {
    label: 'Số lịch tư vấn',
    color: '#60a5fa'
  }
} satisfies ChartConfig

export default function UserDashBoard() {
  return (
    <div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>30</div>
          <div className='text-sm'>Tổng số câu hỏi đã đặt ra</div>
        </div>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>5</div>
          <div className='text-sm'>Tổng số câu hỏi trên 500 like</div>
        </div>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>2</div>
          <div className='text-sm'>Tổng số lịch hẹn tư vấn</div>
        </div>
        <div className='col-span-1 px-6 py-2 rounded-lg shadow-lg text-center'>
          <div className='font-bold text-4xl mb-2 text-primary'>4</div>
          <div className='text-sm'>Tổng số form đánh giá đã gửi</div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='mb-3 font-bold text-gray-500 italic'>
          Thống kê số lượng câu hỏi và lịch tư vấn trong năm 2024
        </div>
        <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey='question' fill='var(--color-question)' radius={4} />
            <Bar dataKey='schedual' fill='var(--color-schedual)' radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
