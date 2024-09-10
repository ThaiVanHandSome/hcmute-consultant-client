import { FloatingArrow, FloatingPortal, Placement, arrow, shift, useFloating, useId } from '@floating-ui/react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'

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
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      shift(),
      arrow({
        element: arrowRef
      })
    ],
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
              <FloatingArrow ref={arrowRef} context={context} fill='white' />
              <div className='bg-white relative shadow-lg rounded-lg overflow-hidden'>{renderPopover}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}
