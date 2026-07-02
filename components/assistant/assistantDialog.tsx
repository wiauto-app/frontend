"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, Dialog } from "../ui/dialog";
import { Assistant } from "./assistant";
import { SidebarProvider } from "../ui/sidebar";
import Link from "next/link";
import { MessageSquareIcon } from "lucide-react";
export const AssistantDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Link href="/asistente/chat">
        <Button className="fixed bottom-4 right-4">
          <MessageSquareIcon className="size-6" />
          Asistente
        </Button>
      </Link>
    </>
  );
};
