import { Suspense } from "react";
import { AssistantChatProvider } from "@/components/assistant/assistantChatProvider";
import { AssistantLayoutHeader } from "@/components/assistant/assistantLayoutHeader";
import { AssistantMainArea } from "@/components/assistant/assistantMainArea";
import { AssistantSidebar } from "@/components/assistant/assistantSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

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

export default function Layout({ children }: LayoutProps) {
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
}
