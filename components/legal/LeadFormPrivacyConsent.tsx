"use client";

import Link from "next/link";

import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { cn } from "@/lib/utils";

interface LeadFormPrivacyConsentProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  errorMessage?: string;
  className?: string;
}

export const LeadFormPrivacyConsent = ({
  id,
  checked,
  onChange,
  onBlur,
  name,
  disabled,
  errorMessage,
  className,
}: LeadFormPrivacyConsentProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <CustomCheckbox
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        label={
          <span className="text-xs leading-relaxed text-muted-foreground">
            He leído y acepto la{" "}
            <Link
              href="/privacidad"
              className="font-medium text-primary underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de privacidad
            </Link>{" "}
            y la{" "}
            <Link
              href="/aviso-legal"
              className="font-medium text-primary underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              información legal
            </Link>
            .
          </span>
        }
      />
      {errorMessage ? (
        <p className="text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
