"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { usePathname } from "next/navigation";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import {
  REPORT_TARGET_TYPE,
  type ReportTarget,
} from "@/interfaces/report.interface";
import {
  type Publisher,
  type PublisherType,
  type VehicleDetailDealership,
} from "@/interfaces/vehicle.interface";
import { resolveAdvertiserReportTarget } from "@/lib/reports/resolve-advertiser-report-target";
import { cn } from "@/lib/utils";

import { ReportDialog } from "./ReportDialog";

type ReportButtonBaseProps = {
  variant?: "ghost" | "outline" | "link";
  className?: string;
  onSuccess?: () => void;
};

type ReportButtonWithTargetProps = ReportButtonBaseProps & {
  target: ReportTarget;
};

type ReportButtonFromVehicleProps = ReportButtonBaseProps & {
  publisherType: PublisherType;
  profileId?: string;
  publisher: Pick<Publisher, "id" | "name">;
  dealership?: Pick<VehicleDetailDealership, "id" | "name">;
};

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
  const { variant = "outline", className, onSuccess } = props;
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

  const targetLabel =
    target.targetType === REPORT_TARGET_TYPE.DEALERSHIP
      ? "concesionario"
      : "vendedor";

  return (
    <>
      <Button
        type="button"
        size={variant === "link" ? "default" : "icon"}
        variant={variant}
        className={cn(
          variant === "outline" &&
            "rounded-md border-2 border-muted-foreground/50 text-muted-foreground hover:bg-muted hover:text-foreground",
          variant === "ghost" &&
            "rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
          variant === "link" && "h-auto px-0 text-sm text-muted-foreground",
          className,
        )}
        aria-label={`Reportar ${targetLabel}`}
        disabled={isLoading}
        onClick={(event) => {
          event.stopPropagation();
          handleOpenReport();
        }}
      >
        <Flag className={cn("size-4", variant === "link" && "mr-2")} aria-hidden />
        {variant === "link" ? `Reportar ${targetLabel}` : null}
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
