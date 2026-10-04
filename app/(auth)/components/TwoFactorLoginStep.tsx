"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  verifyBackupCodeAction,
  verifyTwoFactorAction,
} from "@/app/(auth)/authActions/verifyTwoFactorAction";
import { AUTENTICACION_DEFAULT } from "@/app/(auth)/content/autenticacion.fallback";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import type { StrapiAuthVerificacion2fa } from "@/interfaces/strapi-components.interface";
import { authService } from "@/services/authService";
import {
  createBackupCodeSchema,
  formatBackupCode,
} from "@/validations/backupCode.schema";

type TwoFactorLoginStepProps = {
  /** Textos de `auth.verificacion-2fa`; sin ellos se usan los de respaldo. */
  content?: StrapiAuthVerificacion2fa;
  email: string;
  onSuccess: () => Promise<void>;
  onBack: () => Promise<void>;
};

export const TwoFactorLoginStep = ({
  content = AUTENTICACION_DEFAULT.verificacion_2fa as StrapiAuthVerificacion2fa,
  email,
  onSuccess,
  onBack,
}: TwoFactorLoginStepProps) => {
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backupCodeSchema = useMemo(
    () => createBackupCodeSchema(content.codigo_respaldo),
    [content.codigo_respaldo],
  );

  const handleVerifyTotp = async (code: string) => {
    if (code.length !== 6 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const result = await verifyTwoFactorAction(code);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(content.mensajes?.exito);
      await onSuccess();
      return;
    }

    toast.error(result.message || content.mensajes?.error_generico);
    setTotpCode("");
  };

  const handleVerifyBackup = async () => {
    const formattedCode = formatBackupCode(backupCode);
    const parsed = backupCodeSchema.safeParse({ code: formattedCode });

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? content.codigo_respaldo?.mensaje_invalido,
      );
      return;
    }

    setIsSubmitting(true);
    const result = await verifyBackupCodeAction(parsed.data.code);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(content.mensajes_respaldo?.exito);
      await onSuccess();
      return;
    }

    toast.error(result.message || content.mensajes_respaldo?.error_generico);
    setBackupCode("");
  };

  const handleBack = async () => {
    await authService.logout();
    setTotpCode("");
    setBackupCode("");
    setUseBackupCode(false);
    await onBack();
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <StrapiEncabezado
        content={content.encabezado}
        as="h1"
        className="mb-8"
        titleClassName="mb-2 text-2xl font-semibold tracking-tight"
        descriptionClassName="mt-0 text-gray-600"
      >
        {" "}
        <span className="font-medium text-gray-900">{email}</span>
      </StrapiEncabezado>

      {!useBackupCode ? (
        <div className="flex flex-col items-center gap-6">
          <InputOTP
            maxLength={6}
            value={totpCode}
            onChange={(value) => {
              setTotpCode(value);
              if (value.length === 6) {
                void handleVerifyTotp(value);
              }
            }}
            disabled={isSubmitting}
            aria-label={content.codigo?.label}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            type="button"
            className="h-11 w-full text-base"
            disabled={isSubmitting || totpCode.length !== 6}
            onClick={() => void handleVerifyTotp(totpCode)}
          >
            {content.boton_verificar?.label}
          </Button>

          <button
            type="button"
            className="text-sm text-blue-600 underline-offset-4 hover:underline"
            onClick={() => setUseBackupCode(true)}
          >
            {content.boton_usar_respaldo}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            value={backupCode}
            onChange={(event) =>
              setBackupCode(formatBackupCode(event.target.value))
            }
            placeholder={content.codigo_respaldo?.placeholder ?? undefined}
            autoComplete="one-time-code"
            aria-label={content.codigo_respaldo?.label}
            className="h-11 text-center font-mono uppercase tracking-widest"
            maxLength={9}
          />

          <Button
            type="button"
            className="h-11 w-full text-base"
            disabled={isSubmitting}
            onClick={() => void handleVerifyBackup()}
          >
            {content.boton_verificar_respaldo?.label}
          </Button>

          <button
            type="button"
            className="text-sm text-blue-600 underline-offset-4 hover:underline"
            onClick={() => setUseBackupCode(false)}
          >
            {content.boton_usar_autenticador}
          </button>
        </div>
      )}

      <button
        type="button"
        className="mt-8 flex w-full items-center justify-center text-sm text-gray-500 transition-colors hover:text-gray-900"
        onClick={() => void handleBack()}
      >
        {content.boton_volver}
      </button>
    </div>
  );
};
