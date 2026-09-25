"use client";

import { AssistantInput } from "./assistantInput";
import { AssistantMessages } from "./assistantMessages";

export const AssistantContent = () => {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden border-none "
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden ">
        <AssistantMessages />
      </div>
      <div className="shrink-0 flex-col gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
        <AssistantInput />

        <p className="text-center text-[10px] text-muted-foreground sm:text-xs">
          <span className="font-bold text-primary">WiAuto AI</span> es un
          asistente para ayudar a los usuarios a encontrar vehículos de forma
          rápida y sencilla.
        </p>
      </div>
    </div>
  );
};
