import { cn } from "@/lib/utils"

export const HeroDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("hidden text-base text-white/90 text-center md:block lg:text-left max-w-full lg:max-w-md", className)}>{children}</div>
  )
}
