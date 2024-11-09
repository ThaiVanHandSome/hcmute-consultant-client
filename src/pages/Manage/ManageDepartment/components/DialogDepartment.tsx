import { addAdminDepartment, updateAdminDepartment } from '@/apis/department.api'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import useDepartmentQueryConfig from '@/hooks/useDepartmentQueryConfig'
import { AdminDepartment } from '@/types/department.type'
import { DepartmentSchema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly children: React.ReactNode
  readonly department?: AdminDepartment
}

type FormData = yup.InferType<typeof DepartmentSchema>

export default function DialogDepartment({ children, department }: Props) {
  const isUpdate = !!department

  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const departmentQueryConfig = useDepartmentQueryConfig()

  const form = useForm<FormData>({
    defaultValues: {
      name: department?.name ?? '',
      description: department?.description ?? '',
      logo: department?.logo ?? ''
    },
    resolver: yupResolver(DepartmentSchema)
  })

  const addDepartmentMutation = useMutation({
    mutationFn: (body: FormData) => addAdminDepartment(body)
  })

  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: FormData }) => updateAdminDepartment(id, body)
  })

  const onSubmit = form.handleSubmit((values) => {
    if (isUpdate) {
      updateDepartmentMutation.mutate(
        {
          id: department.id,
          body: values
        },
        {
          onSuccess: (res) => {
            toast({
              variant: 'success',
              description: res.data.message
            })
            setOpen(false)
            queryClient.invalidateQueries({
              queryKey: ['admin-departments', departmentQueryConfig]
            })
          }
        }
      )
      return
    }
    addDepartmentMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['admin-departments', departmentQueryConfig]
        })
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Chỉnh sửa khoa' : 'Thêm khoa'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom control={form.control} name='name' placeholder='Tên khoa' label='Tên khoa' />
              <InputCustom control={form.control} name='description' placeholder='Mô tả' label='Mô tả' />
              <InputCustom control={form.control} name='logo' placeholder='Logo' label='Logo' />
              <Button
                isLoading={addDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                disabled={addDepartmentMutation.isPending || updateDepartmentMutation.isPending}
              >
                {isUpdate ? 'Lưu' : 'Thêm'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
