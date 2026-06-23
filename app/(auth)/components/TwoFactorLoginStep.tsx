"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  verifyBackupCodeAction,
  verifyTwoFactorAction,
} from "@/app/(auth)/authActions/verifyTwoFactorAction";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import {
  backupCodeSchema,
  formatBackupCode,
} from "@/validations/backupCode.schema";

type TwoFactorLoginStepProps = {
  email: string;
  onSuccess: () => Promise<void>;
  onBack: () => Promise<void>;
};

export const TwoFactorLoginStep = ({
  email,
  onSuccess,
  onBack,
}: TwoFactorLoginStepProps) => {
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyTotp = async (code: string) => {
    if (code.length !== 6 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const result = await verifyTwoFactorAction(code);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Verificación completada");
      await onSuccess();
      return;
    }

    toast.error(result.message || "Código incorrecto");
    setTotpCode("");
  };

  const handleVerifyBackup = async () => {
    const formattedCode = formatBackupCode(backupCode);
    const parsed = backupCodeSchema.safeParse({ code: formattedCode });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Código inválido");
      return;
    }

    setIsSubmitting(true);
    const result = await verifyBackupCodeAction(parsed.data.code);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Código de respaldo validado");
      await onSuccess();
      return;
    }

    toast.error(result.message || "Código de respaldo incorrecto");
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
      <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-gray-900">
        Verificación en dos pasos
      </h1>
      <p className="mb-8 text-center text-sm text-gray-600">
        Ingresa el código de tu autenticador para{" "}
        <span className="font-medium text-gray-900">{email}</span>
      </p>

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
            aria-label="Código de verificación de 6 dígitos"
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
            Verificar
          </Button>

          <button
            type="button"
            className="text-sm text-blue-600 underline-offset-4 hover:underline"
            onClick={() => setUseBackupCode(true)}
          >
            Usar código de respaldo
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            value={backupCode}
            onChange={(event) =>
              setBackupCode(formatBackupCode(event.target.value))
            }
            placeholder="XXXX-XXXX"
            autoComplete="one-time-code"
            aria-label="Código de respaldo"
            className="h-11 text-center font-mono uppercase tracking-widest"
            maxLength={9}
          />

          <Button
            type="button"
            className="h-11 w-full text-base"
            disabled={isSubmitting}
            onClick={() => void handleVerifyBackup()}
          >
            Verificar código de respaldo
          </Button>

          <button
            type="button"
            className="text-sm text-blue-600 underline-offset-4 hover:underline"
            onClick={() => setUseBackupCode(false)}
          >
            Usar código del autenticador
          </button>
        </div>
      )}

      <button
        type="button"
        className="mt-8 flex w-full items-center justify-center text-sm text-gray-500 transition-colors hover:text-gray-900"
        onClick={() => void handleBack()}
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
};
