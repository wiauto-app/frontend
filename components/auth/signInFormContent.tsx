"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginAction } from "@/app/(auth)/authActions/authActions";
import { AppleLogin } from "@/app/(auth)/components/appleLogin";
import { GoogleLogin } from "@/app/(auth)/components/googleLogin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoginDto, LoginSchema } from "@/validations/Schemas";
import { PasswordInput } from "../ui/passwordInput";

export type SignInFormContentProps = {
  onSuccess: () => void | Promise<void>;
  showTitle?: boolean;
  showSocialLogins?: boolean;
  className?: string;
  returnTo?: string;
};

export const SignInFormContent = ({
  onSuccess,
  showTitle = true,
  showSocialLogins = true,
  className,
  returnTo,
}: SignInFormContentProps) => {
  const router = useRouter();
  const formId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginDto) => {
    setIsLoading(true);

    try {
      await loginAction(data);
      await onSuccess();
    } catch (error: Error | unknown) {
      console.error("Login error:", error);


      if (
        (error as Error).message?.includes("No se encontró") ||
        (error as Error).message?.includes("incorrectos")
      ) {
        toast.error((error as Error).message || "Error al iniciar sesión");
      } else {
        toast.error((error as Error).message || "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full space-y-8", className)}>
      {showTitle ? (
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Inicia Sesión
        </h2>
      ) : null}

      {showSocialLogins ? (
        <>
          <div className="flex gap-3">
            <GoogleLogin
              disabled={isLoading}
              returnTo={returnTo}
              onSuccess={onSuccess}
            />
            <AppleLogin
              disabled={isLoading}
              returnTo={returnTo}
              onSuccess={onSuccess}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-400">o</span>
            </div>
          </div>
        </>
      ) : null}

      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor={`${formId}-email`}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <Input
            id={`${formId}-email`}
            type="email"
            placeholder="Email *"
            autoComplete="email"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-password`}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contraseña *
          </label>
          <PasswordInput
            id={`${formId}-password`}
            placeholder="Contraseña *"
            autoComplete="current-password"
            {...form.register("password")}
            disabled={isLoading}
          />
          {form.formState.errors.password ? (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center">
          <Checkbox
            id={`${formId}-keep-logged-in`}
            checked={keepLoggedIn}
            onCheckedChange={(checked) => setKeepLoggedIn(checked === true)}
            disabled={isLoading}
          />
          <label
            htmlFor={`${formId}-keep-logged-in`}
            className="ml-2 block text-sm text-gray-700"
          >
            No cerrar sesión
          </label>
        </div>
      </form>

      <Button
        type="submit"
        form={formId}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : "Iniciar Sesión"}
      </Button>

      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-600">
          ¿Aún no tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Regístrate
          </Link>
        </p>
        <Button
          type="button"
          variant="link"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => router.push("/olvide-contrasena")}
        >
          ¿Olvidaste la contraseña?
        </Button>
      </div>
    </div>
  );
};
