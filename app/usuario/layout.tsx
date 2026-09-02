import { UserSidebar, UserSidebarFallback } from "./components/UserSidebar";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ProfessionalSidebar } from "./components/professionalSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "@/lib/ensure-session.server";
import { Suspense } from "react";

const USER_SIDEBAR_WIDTH = "w-56 lg:w-64";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await getServerSession();
  const planName = data?.billing_summary.plan_name ?? {};

  const showProShell = !!planName;
  const showUserSidebar = !showProShell;
  const layoutVariants = cva(
    "mx-auto w-full px-4 py-2 sm:px-6 md:py-8 lg:px-8 ",
    {
      variants: {
        showProShell: {
          false: "max-w-[1800px] ",
          true: "max-w-full p-0 ",
        },
      },
    },
  );

  return (
    <SidebarProvider>
      {showProShell ? <ProfessionalSidebar /> : null}
      <SidebarInset>
        <div className="min-h-screen bg-muted-foreground/10">
          <div
            className={cn(
              layoutVariants({
                showProShell: showProShell,
              }),
            )}
          >
            <div className="flex flex-col gap-4 md:flex-row md:gap-5">
              {showUserSidebar ? (
                <aside
                  className={`hidden shrink-0 md:block ${USER_SIDEBAR_WIDTH}`}
                >
                  <Suspense fallback={<UserSidebarFallback />}>
                    <UserSidebar />
                  </Suspense>
                </aside>
              ) : null}

              <main className="min-w-0 w-full flex-1 container mx-auto px-0">
                {children}
              </main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
