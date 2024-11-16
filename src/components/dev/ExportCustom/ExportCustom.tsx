import { exportData } from '@/apis/export.api'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutation } from '@tanstack/react-query'

interface Props {
  readonly dataType: string
  readonly queryConfig: any
}

export default function ExportCustom({ dataType, queryConfig }: Props) {
  const exportMutation = useMutation({
    mutationFn: (params: any) => exportData(params)
  })

  const handleExport = (exportType: string) => {
    exportMutation.mutate({
      ...queryConfig,
      dataType,
      exportType
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button isLoading={exportMutation.isPending} disabled={exportMutation.isPending}>
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>Export pdf</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>Export excel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
