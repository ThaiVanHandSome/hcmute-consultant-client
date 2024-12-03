import { createSearchParams, useNavigate } from 'react-router-dom'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
interface Props {
  readonly path: string
  readonly pageSize: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly queryConfig: any
  readonly RANGE?: number
  readonly showChooseQuantity?: boolean
}

// if total page is 10
// page 1 active: 1 2 ... 9 10
// page 2 active: 1 2 3 4 ... 9 10
// page 3 active: 1 2 3 4 5 ... 9 10
// page 4 active: 1 2 3 4 5 6 ... 9 10
// page 5 active: 1 2 3 4 5 6 7 ... 9 10
// page 6 active: 1 2 ... 4 5 6 7 8 9 10
// page 7 active: 1 2 ... 5 6 7 8 9 10
// page 8 active: 1 2 ... 6 7 8 9 10
// page 9 active: 1 2 ... 7 8 9 10
// page 10 active: 1 2 ... 8 9 10

export default function Paginate({ path, queryConfig, pageSize, RANGE = 2, showChooseQuantity = true }: Props) {
  const navigate = useNavigate()
  const [range, setRange] = useState<number>(RANGE)
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(1)
      .map((_, index) => {
        const pageNumber = index
        if (page <= range * 2 + 1 && pageNumber > page + range && pageNumber < pageSize - range + 1) {
          return renderDotAfter()
        } else if (page > range * 2 + 1 && page < pageSize - range * 2) {
          if (pageNumber < page - range && pageNumber > range) {
            return renderDotBefore()
          } else if (pageNumber > page + range && pageNumber <= pageSize - range) {
            return renderDotAfter()
          }
        } else if (page >= pageSize - range * 2 && pageNumber < page - range && pageNumber > range) {
          return renderDotBefore()
        }
        return (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              to={{
                pathname: path,
                search: createSearchParams({
                  ...queryConfig,
                  page: pageNumber.toString()
                }).toString()
              }}
              isActive={page === pageNumber}
            >
              {pageNumber + 1}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }

  const handleValueChange = (val: string) => {
    navigate({
      pathname: path,
      search: createSearchParams({
        ...queryConfig,
        page: '0',
        size: val
      }).toString()
    })
  }

  return (
    <div className='flex items-center justify-center relative w-full'>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to={{
                  pathname: path,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                disabled={page === 0}
              />
            </PaginationItem>
            <div className='hidden lg:block'>{renderPagination()}</div>
            <div className='size-9 text-sm flex items-center justify-center border rounded-lg'>{page + 1}</div>
            <PaginationItem>
              <PaginationNext
                to={{
                  pathname: path,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                disabled={page >= pageSize - 1}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {showChooseQuantity && (
        <div className='hidden lg:block absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2'>
          <Select defaultValue={queryConfig.size} onValueChange={handleValueChange}>
            <SelectTrigger>
              <SelectValue placeholder='Theme' />
            </SelectTrigger>
            <SelectContent className='!px-4'>
              {Array(6)
                .fill(1)
                .map((item, index) => (
                  <SelectItem key={index} value={String(item * (index + 1) * 5)}>
                    {item * (index + 1) * 5}
                  </SelectItem>
                ))}
              <SelectItem value='1000000'>All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
