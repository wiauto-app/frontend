import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { accountService } from "@/services/accountService";
import { HiMail, HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import type {
  AccountSettings,
  AuthProvider,
} from "@/interfaces/account.interface";
import {
  updateEmailSchema,
  type UpdateEmailFormValues,
} from "../schemas/update-email.schema";
import { Check } from "lucide-react";

interface EmailSettingsSectionProps {
  account: AccountSettings;
  onUpdated: () => Promise<void>;
}

const providerLabel: Record<
  AuthProvider,
  {
    label: string;
    icon: React.ReactNode;
  }
> = {
  local: {
    label: "Email y contraseña",
    icon: <HiMail className="size-5" />,
  },
  google: {
    label: "Google",
    icon: <FcGoogle />,
  },
  apple: {
    label: "Apple",
    icon: <FaApple />,
  },
};

export const EmailSettingsSection = ({
  account,
  onUpdated,
}: EmailSettingsSectionProps) => {
  const hasPassword = account.has_password;
  const linkedProviders = account.providers.filter(
    (provider) => provider !== "local",
  );

  const form = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: account.email },
  });

  useEffect(() => {
    form.reset({ email: account.email });
  }, [account.email, form]);

  const handleSubmit = async (values: UpdateEmailFormValues) => {
    const response = await accountService.updateEmail(values);

    if (response.ok) {
      toast.success(
        accountService.getResponseMessage(
          response,
          "Email actualizado correctamente",
        ),
      );
      await onUpdated();
      return;
    }

    toast.error(
      accountService.getResponseMessage(
        response,
        "No se pudo actualizar el correo",
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cuenta</CardTitle>
        <CardDescription>
          {hasPassword
            ? "Correo de acceso y estado de verificación."
            : "Tu cuenta está vinculada a proveedores externos."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {account.providers.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {account.providers.map((provider) => (
              <Badge key={provider} variant="secondary" className="h-auto">
                {providerLabel[provider].icon}
                {providerLabel[provider].label}
              </Badge>
            ))}
            {!hasPassword && (
              <span className="text-sm text-muted-foreground">
                {account.email}
              </span>
            )}
          </div>
        )}
        {hasPassword && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {account.is_email_verified ? (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 border border-green-500 text-green-500"
                >
                  Correo verificado <Check />
                </Badge>
              ) : (
                <Badge variant="outline">Verificación pendiente</Badge>
              )}
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="account-email">
                      Correo electrónico
                    </FieldLabel>
                    <Input
                      id="account-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <p className="text-xs text-muted-foreground">
                Al cambiar el correo deberás verificarlo de nuevo.
              </p>

              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Guardando…"
                    : "Actualizar correo"}
                </Button>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
};
