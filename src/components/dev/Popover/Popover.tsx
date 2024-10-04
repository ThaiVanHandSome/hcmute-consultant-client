import { useState } from 'react'

import { FloatingPortal, Placement, shift, useFloating, useId } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  readonly children: React.ReactNode
  readonly renderPopover: React.ReactNode
  readonly className?: string
  readonly initialOpen?: boolean
  readonly placement?: Placement
}

export default function Popover({
  children,
  renderPopover,
  className,
  initialOpen = false,
  placement = 'bottom'
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen)
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift()],
    placement: placement
  })

  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }

  const id = useId()

  return (
    <div className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={floatingStyles}
              initial={{ opacity: 0, zIndex: 50 }}
              animate={{ opacity: 1, zIndex: 50 }}
              exit={{ opacity: 0, zIndex: 50 }}
            >
              <div className='bg-popover text-popover-foreground relative shadow-lg rounded-lg overflow-hidden'>
                {renderPopover}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}
