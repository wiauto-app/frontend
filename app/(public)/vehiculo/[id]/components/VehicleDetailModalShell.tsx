"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface VehicleDetailModalShellProps {
  children: React.ReactNode;
}

export const VehicleDetailModalShell = ({
  children,
}: VehicleDetailModalShellProps) => {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <DrawerPrimitive.Root open onOpenChange={handleOpenChange}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Backdrop
          className="fixed inset-0 z-100 bg-black/50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        />
        <DrawerPrimitive.Viewport className="fixed inset-0 z-100 flex">
          <DrawerPrimitive.Popup
            className={cn(
              "fixed inset-x-0 bottom-0 top-24 z-100 flex w-full flex-col overflow-hidden rounded-t-xl border-t bg-background shadow-lg outline-none",
              "data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom",
            )}
          >
            <DrawerPrimitive.Close
              className="absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar detalle del vehículo"
            >
              <XIcon className="size-4" />
            </DrawerPrimitive.Close>
            <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50">{children}</div>
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
};
