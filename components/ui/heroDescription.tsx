export const HeroDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden text-base text-white/90 text-center md:block lg:text-left max-w-full lg:max-w-md">{children}</div>
  )
}
