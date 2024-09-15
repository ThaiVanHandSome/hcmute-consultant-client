import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { createSearchParams } from 'react-router-dom'
import { QueryConfig } from 'src/hooks/useQueryConfig'
interface Props {
  readonly path: string
  readonly pageSize: number
  readonly queryConfig: QueryConfig
}

const RANGE = 2
export default function Paginate({ path, queryConfig, pageSize }: Props) {
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
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter()
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore()
          } else if (pageNumber > page + RANGE && pageNumber <= pageSize - RANGE) {
            return renderDotAfter()
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber < page - RANGE && pageNumber > RANGE) {
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
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }

  return (
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
        {renderPagination()}
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
  )
}
