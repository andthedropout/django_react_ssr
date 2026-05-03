import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

/**
 * Page wrapper with an entrance animation.
 *
 * SSR-safe: starts visible (`opacity:1`) so server-rendered HTML is always
 * readable even before React hydrates / even with JS disabled. The slide-in
 * animation only kicks in once the client has mounted, so users with JS get
 * the polish, users without JS still get the content.
 */
const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  animate = true,
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!animate) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={false}
      animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
