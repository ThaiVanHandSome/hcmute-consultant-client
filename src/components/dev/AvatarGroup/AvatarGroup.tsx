import { VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import AvatarCustom from '@/components/dev/AvatarCustom'

import { cn } from '@/lib/utils'

const avatarStackVariants = cva('flex', {
  variants: {
    variant: {
      default: 'gap-1',
      stack: 'hover:space-x-1.5 -space-x-2.5 rtl:space-x-reverse'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStackVariants> {
  id: string
  avatars: { url?: string; name: string }[]
  maxAvatarsAmount?: number
}

function AvatarGroup({ id, className, avatars, variant, maxAvatarsAmount = 4, ...props }: AvatarStackProps) {
  const limitedAvatars = avatars.slice(0, maxAvatarsAmount)
  return (
    <div className={cn(avatarStackVariants({ variant }), className)} {...props}>
      {limitedAvatars.slice(0, maxAvatarsAmount).map((avatar, index) => (
        <TooltipProvider key={`${id}-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <AvatarCustom className='size-5' url={avatar.url} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{avatar.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {limitedAvatars.length < avatars.length && (
        <AvatarCustom className='size-5' url='' fallback={`+${avatars.length - limitedAvatars.length}`} />
      )}
    </div>
  )
}

export default AvatarGroup
