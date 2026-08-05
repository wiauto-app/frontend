"use client";

import { Suspense, useState } from "react";
import { Menu } from "lucide-react";
import { UserSidebar, UserSidebarFallback } from "./components/UserSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useUserType } from "@/hooks/useUserType";

const USER_SIDEBAR_WIDTH = "w-72 lg:w-80";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { userType, isParticular } = useUserType();
  const layourVariants = cva(
    "mx-auto w-full px-4 py-2 sm:px-6 md:py-8 lg:px-8 ",
    {
      variants: {
        userType: {
          particular: "max-w-[1800px] ",
          professional: "max-w-full p-0 ",
        },
      },
    },
  );

  return (
    <div className="min-h-screen bg-muted-foreground/10">
      <div className={cn(layourVariants({ userType }))}>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex md:hidden">
            <Sheet open={open} onOpenChange={setOpen} swipeDirection="left">
              <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 shadow-xs hover:bg-muted">
                <Menu className="size-5" aria-hidden />
                <span className="sr-only">Abrir menú de navegación</span>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#F3F5F9] p-2"
                showCloseButton={false}
              >
                <Suspense fallback={<UserSidebarFallback />}>
                  <UserSidebar />
                </Suspense>
              </SheetContent>
            </Sheet>
          </div>

          {isParticular && (
            <aside className={`hidden shrink-0 md:block ${USER_SIDEBAR_WIDTH}`}>
              <Suspense fallback={<UserSidebarFallback />}>
                <UserSidebar />
              </Suspense>
            </aside>
          )}

          <main className="min-w-0 w-full flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
