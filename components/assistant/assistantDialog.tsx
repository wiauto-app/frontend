"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
export const AssistantDialog = () => {
  return (
    <>
      <Link href="/asistente/chat" className="hidden md:block">
        <Button className="fixed bottom-4 right-4">
          <Sparkles className="size-6" />
          <span className="hidden md:block">Asistente</span>
        </Button>
      </Link>
    </>
  );
};
