import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Suspense } from "react";
import { SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { UserSidebar, UserSidebarFallback } from "./UserSidebar";
export const UserSidebarSheet = () => {
  return (
    <div className="flex md:hidden">
      <Sheet >
        <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 shadow-xs hover:bg-muted">
          <Menu className="size-5" aria-hidden />
          <span className="sr-only">Abrir menú de navegación</span>
        </SheetTrigger>
        <SheetContent side="left" className=" p-2" showCloseButton={false}>
          <Suspense fallback={<UserSidebarFallback />}>
            <UserSidebar />
          </Suspense>
        </SheetContent>
      </Sheet>
    </div>
  );
};
