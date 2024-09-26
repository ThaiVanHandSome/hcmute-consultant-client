import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { SuccessResponse } from '@/types/utils.type'
import { ChartStatistics } from '@/types/statistics.type'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Props {
  readonly title: string
  readonly label: string
  readonly getData: (n: number) => Promise<AxiosResponse<SuccessResponse<ChartStatistics[]>, any>>
  readonly keyFn: string
}

const yearsText = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

interface ChartDataType {
  month: string
  value: number
}

export default function ChartWithYear({ title, label, getData, keyFn }: Props) {
  const [year, setYear] = useState<string>('2024')
  const [chartData, setChartData] = useState<ChartDataType[]>()

  const { data: statisticsData } = useQuery({
    queryKey: ['user-statistics-chart' + keyFn, year],
    queryFn: () => getData(parseInt(year))
  })

  const chartConfig = {
    value: {
      label,
      color: '#2563eb'
    }
  } satisfies ChartConfig

  useEffect(() => {
    if (statisticsData?.data.data) {
      const chartData = statisticsData?.data.data.map((item) => ({
        month: yearsText[item.month - 1],
        value: item.count
      }))
      setChartData(chartData)
    }
  }, [statisticsData])

  return (
    <div>
      <div className='flex justify-between items-center mb-2'>
        <div className='mb-3 font-bold text-gray-500 italic'>{title}</div>
        <div>
          <Select defaultValue={year} onValueChange={setYear}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select a year' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Years</SelectLabel>
                <SelectItem value='2020'>2020</SelectItem>
                <SelectItem value='2021'>2021</SelectItem>
                <SelectItem value='2022'>2022</SelectItem>
                <SelectItem value='2023'>2023</SelectItem>
                <SelectItem value='2024'>2024</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
          <Bar dataKey='value' fill='var(--color-value)' radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
