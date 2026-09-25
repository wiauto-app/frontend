import { Suspense } from "react";
import { AssistantLayoutHeader } from "@/components/assistant/assistantLayoutHeader";
import { AssistantLayoutPreview } from "@/components/assistant/AssistantLayoutPreview";
import { AssistantMainArea } from "@/components/assistant/assistantMainArea";
import { AssistantSidebar } from "@/components/assistant/assistantSidebar";
import { AssistantSidebarUiProvider } from "@/components/assistant/assistantSidebarUi";
import { AuthRequiredScreen } from "@/components/auth/AuthRequiredScreen";
import { Spinner } from "@/components/ui/spinner";
import { getServerSession } from "@/lib/ensure-session.server";

interface AssistantLayoutContentProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const AssistantLayoutContent = ({
  children,
  modal,
}: AssistantLayoutContentProps) => {
  return (
    <>
      <AssistantSidebarUiProvider>
        <div className="flex h-[calc(100dvh-6rem)]">
          <AssistantSidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <AssistantLayoutHeader />
            <AssistantMainArea>{children}</AssistantMainArea>
          </div>
        </div>
      </AssistantSidebarUiProvider>
      {modal}
    </>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function Layout({ children, modal }: LayoutProps) {
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
      <AssistantLayoutContent modal={modal}>{children}</AssistantLayoutContent>
    </Suspense>
  );
}
