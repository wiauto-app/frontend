"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Providers from "../providers";
import { UserSidebar } from "./components/UserSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Providers>
      <div className="min-h-screen bg-[#F3F5F9]">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8  py-2 md:py-8">
          <div className="flex flex-col md:flex-row  gap-4 md:gap-8">
            <div className="flex  md:hidden">
              <Sheet open={open} onOpenChange={setOpen} swipeDirection="left">
                <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 shadow-xs hover:bg-muted">
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="left" className="p-2 bg-[#F3F5F9]" showCloseButton={false}>  
                  <UserSidebar />
                </SheetContent>
              </Sheet>
            </div>

            <aside className="hidden md:block w-80 shrink-0">
              <UserSidebar />
            </aside>

            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  );
}
