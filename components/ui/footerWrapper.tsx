"use client"

import { useUserType } from "@/hooks/useUserType";
import { usePathname } from "next/navigation";

export const FooterWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const {isParticular} = useUserType();
  if(pathname.includes("/usuario") && !isParticular) {
    return null
  }
  
  return (
    <div className="mt-20">
      {children}
    </div>
  )
}
