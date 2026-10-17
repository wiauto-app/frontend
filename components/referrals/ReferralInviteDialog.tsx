"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReferralInviteCard } from "./ReferralInviteCard";

interface ReferralInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
  shareUrl: string;
}

export const ReferralInviteDialog = ({
  open,
  onOpenChange,
  referralCode,
  shareUrl,
}: ReferralInviteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-0 bg-transparent p-0 shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Invita a un amigo</DialogTitle>
          <DialogDescription>
            Comparte tu enlace y gana un destacado gratis cuando publiquen su
            coche.
          </DialogDescription>
        </DialogHeader>
        <ReferralInviteCard referralCode={referralCode} shareUrl={shareUrl} />
      </DialogContent>
    </Dialog>
  );
};
