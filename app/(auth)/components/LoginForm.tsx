"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { useUser } from "@/app/contexts/auth/useUser";
import { SignInFormContent } from "@/components/auth/signInFormContent";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import type { StrapiAuthVerificacion2fa } from "@/interfaces/strapi-components.interface";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";

interface LoginFormProps extends AuthPantallaProps<"login"> {
  contentVerificacion: StrapiAuthVerificacion2fa;
}

const LoginFormInner = ({
  content,
  compartido,
  contentVerificacion,
}: LoginFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();

  const redirectParam = searchParams.get("redirect");
  const returnTo =
    redirectParam && isValidReturnPath(redirectParam) ? redirectParam : "/";

  const handleSuccess = async () => {
    await refreshUser();
    toast.success(content.mensajes?.exito);
    router.refresh();
  };

  return (
    <>
      <StrapiEncabezado content={content.encabezado} />
      <SignInFormContent
        onSuccess={handleSuccess}
        showTitle={false}
        returnTo={returnTo}
        content={content}
        compartido={compartido}
        contentVerificacion={contentVerificacion}
      />
    </>
  );
};

export default function LoginForm(props: LoginFormProps) {
  return (
    <Suspense fallback={<StrapiEncabezado content={props.content.encabezado} />}>
      <LoginFormInner {...props} />
    </Suspense>
  );
}
