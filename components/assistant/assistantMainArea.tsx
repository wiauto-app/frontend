"use client";

import { usePathname } from "next/navigation";
import { AssistantContent } from "./assistantContent";
import { cn } from "@/lib/utils";

interface AssistantMainAreaProps {
  children: React.ReactNode;
}

const isPanelOnlyRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith("/asistente/map") ||
    pathname.startsWith("/asistente/search")
  );
};

export const AssistantMainArea = ({ children }: AssistantMainAreaProps) => {
  const pathname = usePathname();
  const showPanelOnly = isPanelOnlyRoute(pathname);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-2 sm:gap-4 sm:p-3 lg:grid-cols-12 lg:p-4">
      <div
        className={cn(
          "flex min-h-0 flex-col overflow-hidden col-span-7",
          showPanelOnly
            ? "hidden lg:flex"
            : "flex",
        )}
      >
        <AssistantContent />
      </div>

      <aside
        className={cn(
          "@container/panel flex min-h-0 flex-col overflow-hidden col-span-5",
          showPanelOnly
            ? "flex"
            : "hidden lg:flex",
        )}
      >
        {children}
      </aside>
    </div>
  );
};
