import { APPRAISAL_STATUS_LABEL } from "@/services/appraisal/appraisal.labels";
import type { AppraisalStatus } from "@/services/appraisal/types/appraisal.types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AppraisalStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  answered: "bg-blue-50 text-blue-700",
  closed: "bg-slate-100 text-slate-600",
  estimated: "bg-blue-50 text-blue-700",
  open_for_offers: "bg-green-50 text-green-700",
  offer_accepted: "bg-emerald-100 text-emerald-800",
  expired: "bg-amber-50 text-amber-800",
};

export const AppraisalStatusBadge = ({
  status,
  className,
}: {
  status: AppraisalStatus;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      STATUS_STYLES[status],
      className,
    )}
  >
    {APPRAISAL_STATUS_LABEL[status]}
  </span>
);
