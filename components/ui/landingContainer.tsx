import { cn } from '@/lib/utils'
import React from 'react'

export const LandingContainer = ({ children, className }: { children: React.ReactNode,className?: string }) => {
  return (
    <div className={cn("container-custom flex flex-col gap-10", className)}>
      {children}
    </div>
  )
}
