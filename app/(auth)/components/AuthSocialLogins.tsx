"use client";

import type { StrapiAuthCompartido } from "@/interfaces/strapi-components.interface";
import type { StrapiComponentProps } from "@/interfaces/strapi-content-props.interface";
import { cn } from "@/lib/utils";

import { AppleLogin } from "./appleLogin";
import { GoogleLogin } from "./googleLogin";

interface AuthSocialLoginsProps
  extends StrapiComponentProps<StrapiAuthCompartido> {
  disabled?: boolean;
  returnTo?: string;
}

/** Botones de Google y Apple más el separador "o" (`auth.compartido`). */
export const AuthSocialLogins = ({
  content,
  className,
  disabled = false,
  returnTo,
}: AuthSocialLoginsProps) => (
  <div className={cn("space-y-4", className)}>
    <div className="flex flex-wrap gap-3">
      <GoogleLogin
        disabled={disabled}
        returnTo={returnTo}
        label={content.boton_google}
      />
      <AppleLogin
        disabled={disabled}
        returnTo={returnTo}
        label={content.boton_apple}
      />
    </div>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-gray-400">
          {content.separador || "o"}
        </span>
      </div>
    </div>
  </div>
);
