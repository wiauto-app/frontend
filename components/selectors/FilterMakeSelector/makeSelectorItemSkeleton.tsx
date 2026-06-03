import React from 'react'
import { Skeleton } from '../../ui/skeleton'
import { Separator } from '../../ui/separator'

export const MakeSelectorItemSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-5 rounded-sm w-full bg-muted-foreground/20" />
      ))}
    </>
  )
}
