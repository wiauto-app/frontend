"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { usePathname } from "next/navigation";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import type { ReportTarget } from "@/interfaces/report.interface";
import {
  type Publisher,
  type PublisherType,
  type VehicleDetailDealership,
} from "@/interfaces/vehicle.interface";
import {
  getReportTargetTypeLabel,
  resolveAdvertiserReportTarget,
} from "@/lib/reports/resolve-advertiser-report-target";
import { cn } from "@/lib/utils";

import { ReportDialog } from "./ReportDialog";

interface ReportButtonBaseProps {
  variant?: "ghost" | "outline" | "link";
  className?: string;
  onSuccess?: () => void;
  label?: string;
}

interface ReportButtonWithTargetProps extends ReportButtonBaseProps {
  target: ReportTarget;
}

interface ReportButtonFromVehicleProps extends ReportButtonBaseProps {
  publisherType: PublisherType;
  profileId?: string;
  publisher: Pick<Publisher, "id" | "name">;
  dealership?: Pick<VehicleDetailDealership, "id" | "name">;
}

export type ReportButtonProps =
  | ReportButtonWithTargetProps
  | ReportButtonFromVehicleProps;

const isVehicleReportProps = (
  props: ReportButtonProps,
): props is ReportButtonFromVehicleProps => "publisherType" in props;

const resolveTargetFromProps = (props: ReportButtonProps): ReportTarget | null => {
  if (isVehicleReportProps(props)) {
    return resolveAdvertiserReportTarget({
      publisherType: props.publisherType,
      profileId: props.profileId,
      publisher: props.publisher,
      dealership: props.dealership,
    });
  }

  return props.target;
};

export const ReportButton = (props: ReportButtonProps) => {
  const { variant = "outline", className, onSuccess, label } = props;
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const target = resolveTargetFromProps(props);

  if (!target) {
    return null;
  }

  const handleOpenReport = () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      setSignInOpen(true);
      return;
    }

    setDialogOpen(true);
  };

  const handleSignInSuccess = () => {
    setSignInOpen(false);
    setDialogOpen(true);
  };

  const targetLabel = getReportTargetTypeLabel(target.targetType);
  const buttonLabel = label ?? `Reportar ${targetLabel}`;
  const showTextLabel = variant === "link" || Boolean(label);

  return (
    <>
      <Button
        type="button"
        size={showTextLabel ? "default" : "icon"}
        variant={variant}
       
        aria-label={buttonLabel}
        disabled={isLoading}
        onClick={(event) => {
          event.stopPropagation();
          handleOpenReport();
        }}
      >
        <Flag className={cn("size-4", showTextLabel && "mr-2")} aria-hidden />
        {showTextLabel ? buttonLabel : null}
      </Button>

      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        returnTo={pathname}
        onSuccess={handleSignInSuccess}
      />

      <ReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        target={target}
        onSuccess={onSuccess}
      />
    </>
  );
};
