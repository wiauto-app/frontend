"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUser } from "@/app/contexts/auth/useUser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { SignInFormContent } from "./signInFormContent";

interface SignInDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onSuccess?: () => void | Promise<void>;
  returnTo?: string;
}

export const SignInDialog = ({
  open,
  onOpenChange,
  trigger,
  onSuccess,
  returnTo,
}: SignInDialogProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { refreshUser } = useUser();
  const [internalOpen, setInternalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const resolvedReturnTo = returnTo ?? pathname;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      setFormKey((current) => current + 1);
    }
  };

  const handleSuccess = async () => {
    await refreshUser();
    handleOpenChange(false);
    await onSuccess?.();
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent
        className={cn(
          "max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-md",
        )}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">
            Inicia Sesión
          </DialogTitle>
        </DialogHeader>
        <SignInFormContent
          key={formKey}
          showTitle={false}
          onSuccess={handleSuccess}
          returnTo={resolvedReturnTo}
        />
      </DialogContent>
    </Dialog>
  );
};
