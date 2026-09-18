"use client";

import {
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from "react";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller";
import { cn } from "@/lib/utils";

export interface MessagesContainerHandle {
  scrollToEnd: (options?: { behavior?: ScrollBehavior }) => boolean;
}

interface MessagesContainerProps {
  children: ReactNode;
  className?: string;
}

const MessagesScrollerApi = forwardRef<MessagesContainerHandle>(
  function MessagesScrollerApi(_props, ref) {
    const { scrollToEnd } = useMessageScroller();

    useImperativeHandle(
      ref,
      () => ({
        scrollToEnd: (options) =>
          scrollToEnd({
            behavior: options?.behavior ?? "smooth",
            align: "end",
          }),
      }),
      [scrollToEnd],
    );

    return null;
  },
);

export const MessagesContainer = forwardRef<
  MessagesContainerHandle,
  MessagesContainerProps
>(function MessagesContainer({ children, className }, ref) {
  return (
    <MessageScrollerProvider
      autoScroll
      defaultScrollPosition="end"
    >
      <MessagesScrollerApi ref={ref} />
      <MessageScroller className={cn("min-h-0 flex-1", className)}>
        <MessageScrollerViewport aria-label="Mensajes de la conversación">
          <MessageScrollerContent className="gap-4 px-1 py-4">
            {children}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton
          direction="end"
          aria-label="Ir al final de la conversación"
        />
      </MessageScroller>
    </MessageScrollerProvider>
  );
});
