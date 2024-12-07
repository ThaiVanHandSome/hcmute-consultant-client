import { getAdminConsultantRole, getAdminRole } from '@/apis/role.api'
import { updateAdminAccount } from '@/apis/user.api'
import CheckboxCustom from '@/components/dev/Form/CheckboxCustom'
import InputCustom from '@/components/dev/Form/InputCustom'
import SelectionCustom from '@/components/dev/Form/SelectionCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import useConsultantRoleQueryConfig from '@/hooks/useConsultantRoleQueryConfig'
import useRoleQueryConfig from '@/hooks/useRoleQueryConfig'
import useUserQueryConfig from '@/hooks/useUserQueryConfig'
import { AdminUser } from '@/types/user.type'
import { FormControlItem } from '@/types/utils.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  readonly children: React.ReactNode
  readonly user: AdminUser
}

export interface AccountRequest {
  activity?: boolean
  roleId?: string
  roleConsultantId?: string
  username?: string
  email?: string
  password?: ''
}

export default function DialogUser({ user, children }: Props) {
  const form = useForm({
    defaultValues: {
      activity: user.isActivity,
      roleId: user.role.id,
      roleConsultantId: user.roleConsultant,
      username: user.username ?? '',
      email: user.email ?? '',
      password: ''
    }
  })

  const [isChangePassword, setIsChangePassword] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const userQueryConfig = useUserQueryConfig()

  const roleQueryConfig = useRoleQueryConfig()
  const { data: roles } = useQuery({
    queryKey: ['admin-roles', roleQueryConfig],
    queryFn: () => getAdminRole(roleQueryConfig)
  })

  const roleSelectionData: FormControlItem[] | undefined = useMemo(() => {
    if (!roles) return
    return roles.data.data.content.map((role) => ({
      value: String(role.id),
      label: role.name
    }))
  }, [roles])

  const consultantRoleQueryConfig = useConsultantRoleQueryConfig()
  const { data: consultantRoles } = useQuery({
    queryKey: ['admin-consultant-roles', consultantRoleQueryConfig],
    queryFn: () => getAdminConsultantRole(consultantRoleQueryConfig)
  })

  const roleConsultantSelectionData: FormControlItem[] | undefined = useMemo(() => {
    if (!consultantRoles) return
    return consultantRoles.data.data.content.map((role) => ({
      value: String(role.id),
      label: role.name
    }))
  }, [consultantRoles])

  const roleId = form.watch('roleId')
  const isRoleConsultant = useMemo(() => {
    return roles?.data.data.content.find((item) => item.id === parseInt(String(roleId)))?.name === 'ROLE_TUVANVIEN'
  }, [roleId])

  const updateAdminAccountMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: AccountRequest }) => updateAdminAccount(id, body)
  })

  const onSubmit = form.handleSubmit((values) => {
    const body: AccountRequest = { ...values } as unknown as AccountRequest
    updateAdminAccountMutation.mutate(
      {
        id: user.id,
        body
      },
      {
        onSuccess: (res) => {
          toast({
            description: res.data.message
          })
          setOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['admin-users', userQueryConfig]
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
          <DialogTitle>Người dùng</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className='space-y-4'>
                <CheckboxCustom control={form.control} name='activity' label='Còn sử dụng' />
                <InputCustom control={form.control} name='username' label='Username' />
                <InputCustom control={form.control} name='email' label='Email' />
                <SelectionCustom control={form.control} name='roleId' label='Quyền' data={roleSelectionData} />
                {isRoleConsultant && (
                  <SelectionCustom
                    control={form.control}
                    name='roleConsultantId'
                    label='Quyền tư vấn viên'
                    data={roleConsultantSelectionData}
                  />
                )}
                <div className='flex items-center space-x-2'>
                  <Switch checked={isChangePassword} onCheckedChange={setIsChangePassword} id='change-password' />
                  <Label htmlFor='change-password'>Đổi mật khẩu</Label>
                </div>
                {isChangePassword && <InputCustom control={form.control} name='password' label='Mật khẩu mới' />}
                <Button
                  disabled={updateAdminAccountMutation.isPending}
                  isLoading={updateAdminAccountMutation.isPending}
                >
                  Lưu
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
