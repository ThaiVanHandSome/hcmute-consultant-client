import { addUsersToGroup, getUsers } from '@/apis/conversation.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import { Conversation } from '@/types/conversation.type'
import { User } from '@/types/user.type'
import { CheckedState } from '@radix-ui/react-checkbox'
import { PlusIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import { useContext, useState } from 'react'

interface Props {
  readonly conversation: Conversation
}

export default function DialogAddMember({ conversation }: Props) {
  const { role } = useContext(AppContext)

  const [open, setOpen] = useState<boolean>(false)
  const [userChoosen, setUserChoosen] = useState<User[]>([])

  const { data: users } = useQuery({
    queryKey: ['users-conversation'],
    queryFn: getUsers,
    enabled: role === ROLE.consultant
  })

  const addUserMutation = useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: number; body: { emailToApprove: string[] } }) =>
      addUsersToGroup(conversationId, body)
  })

  const handleAddUsers = () => {
    const usersEmail = userChoosen.map((user) => user.email)
    const body = {
      emailToApprove: usersEmail
    }
    const conversationId = conversation.id
    addUserMutation.mutate(
      { conversationId, body },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          setOpen(false)
        }
      }
    )
  }

  const removeUser = (user: User) => {
    setUserChoosen((prev) => {
      const newState = [...prev]
      const existedUserIndex = newState.findIndex((item) => item.email === user.email)
      newState.splice(existedUserIndex, 1)
      return newState
    })
  }

  const handleToggleUser = (checked: CheckedState, user: User) => {
    if (checked) {
      setUserChoosen((prev) => {
        const newState = [...prev, user]
        return newState
      })
      return
    }
    removeUser(user)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='size-9 flex items-center justify-center rounded-full hover:bg-secondary cursor-pointer'>
          <PlusIcon className='size-4 text-secondary-foreground' />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
        </DialogHeader>
        <div className='px-1'>
          {userChoosen.length !== 0 && (
            <div className='flex items-center space-x-2 mb-4'>
              {userChoosen.map((user) => (
                <div key={user.email} className='relative'>
                  <AvatarCustom url={user.avatarUrl} />
                  <div
                    aria-hidden='true'
                    onClick={() => removeUser(user)}
                    className='absolute top-0 right-0 flex items-center justify-center bg-secondary rounded-full cursor-pointer'
                  >
                    <XIcon className='size-3 text-secondary-foreground' />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div>
            {users?.data.data.map((user) => (
              <div key={user.email} className='flex items-center justify-between px-2 py-1 mb-2'>
                <div className='flex items-center'>
                  <AvatarCustom url={user.avatarUrl} />
                  <p className='ml-2 font-semibold'>{user.name}</p>
                </div>
                <Checkbox
                  checked={userChoosen.some((item) => item.email === user.email)}
                  onCheckedChange={(c) => handleToggleUser(c, user)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <Button
            isLoading={addUserMutation.isPending}
            disabled={addUserMutation.isPending}
            type='button'
            className='w-full'
            onClick={handleAddUsers}
          >
            Thêm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
