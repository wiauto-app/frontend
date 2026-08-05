import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface IAButtonProps extends React.ComponentProps<typeof Button> {
  className?: string
}

export const IAButton = ({ className, ...props }: IAButtonProps) => {
  return (
    <Button className={cn(
      "from-primary to-purple bg-linear-to-r  px-5 ",
      className,
    )} {...props}>

    </Button>
  )
}
