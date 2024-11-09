import { getAllDepartments } from '@/apis/department.api'
import { addAdminField } from '@/apis/field.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useFieldQueryConfig from '@/hooks/useFieldQueryConfig'
import { AdminField } from '@/types/field.type'
import { FormControlItem } from '@/types/utils.type'
import { FieldSchema } from '@/utils/rules'
import { generateSelectionData } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = yup.InferType<typeof FieldSchema>

interface Props {
  readonly children: React.ReactNode
  readonly field?: AdminField
}

export default function DialogField({ children, field }: Props) {
  const isUpdate = !!field

  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const fieldQueryConfig = useFieldQueryConfig()

  const form = useForm<FormData>({
    defaultValues: {
      name: field?.name ?? '',
      departmentId: String(field?.departmentId ?? '')
    },
    resolver: yupResolver(FieldSchema)
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  })

  // generate selection data
  const departmentsSelectionData: FormControlItem[] | undefined = useMemo(() => {
    const data = departments?.data.data
    return generateSelectionData(data)
  }, [departments])

  const createFieldMutation = useMutation({
    mutationFn: ({ name, departmentId }: { name: string; departmentId: string }) => addAdminField(name, departmentId)
  })

  const onSubmit = form.handleSubmit((values) => {
    if (isUpdate) {
      return
    }
    createFieldMutation.mutate(
      {
        name: values.name,
        departmentId: values.departmentId
      },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          setOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['admin-fields', fieldQueryConfig]
          })
        }
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Chỉnh sửa lĩnh vực' : 'Thêm lĩnh vực'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='name' placeholder='Tên lĩnh vực' label='Tên lĩnh vực' />
              <SelectionCustom
                control={form.control}
                name='departmentId'
                placeholder='Khoa'
                label='Khoa'
                data={departmentsSelectionData}
              />
              <Button>{isUpdate ? 'Lưu' : 'Thêm'}</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
