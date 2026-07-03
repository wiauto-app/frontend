import { Suspense } from "react";
import { AssistantChatProvider } from "@/components/assistant/assistantChatProvider";
import { AssistantLayoutHeader } from "@/components/assistant/assistantLayoutHeader";
import { AssistantLayoutPreview } from "@/components/assistant/AssistantLayoutPreview";
import { AssistantMainArea } from "@/components/assistant/assistantMainArea";
import { AssistantSidebar } from "@/components/assistant/assistantSidebar";
import { AuthRequiredScreen } from "@/components/auth/AuthRequiredScreen";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { getServerSession } from "@/lib/ensure-session.server";

interface AssistantLayoutContentProps {
  children: React.ReactNode;
}

const AssistantLayoutContent = ({ children }: AssistantLayoutContentProps) => {
  return (
    <AssistantChatProvider>
      <SidebarProvider defaultOpen>
        <AssistantSidebar />
        <SidebarInset className="flex h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] flex-col overflow-hidden max-md:h-[calc(100dvh-7rem)] max-md:max-h-[calc(100dvh-7rem)]">
          <AssistantLayoutHeader />
          <AssistantMainArea>{children}</AssistantMainArea>
        </SidebarInset>
      </SidebarProvider>
    </AssistantChatProvider>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await getServerSession();

  if (!session.ok) {
    return (
      <AuthRequiredScreen returnTo="/asistente/chat">
        <AssistantLayoutPreview />
      </AuthRequiredScreen>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-100px)] items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <AssistantLayoutContent>{children}</AssistantLayoutContent>
    </Suspense>
  );
};
