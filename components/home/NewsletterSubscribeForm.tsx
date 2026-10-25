"use client";

import { ChevronRight } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  HoneypotField,
  buildHoneypotPayload,
} from "@/components/forms/HoneypotField";
import { FormDataProtectionNotice } from "@/components/legal/FormDataProtectionNotice";
import { Input } from "@/components/ui/input";
import { trackNewsletterSignup } from "@/lib/analytics/events";
import { NEWSLETTER_LOCATION } from "@/lib/analytics/contactMethod";
import { newsletterService } from "@/services/newsletterService";

import { BRAND_BLUE } from "./data/home-data";

export const NewsletterSubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      toast.error("Introduce un correo electrónico válido");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await newsletterService.subscribe({
        email: normalized,
        ...buildHoneypotPayload(honeypotRef.current?.value),
      });
      if (!response.ok) {
        toast.error(
          response.message || "No se pudo completar la suscripción",
        );
        return;
      }

      trackNewsletterSignup(NEWSLETTER_LOCATION.FOOTER_NEWSLETTER);
      toast.success("Te has suscrito al newsletter correctamente");
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo completar la suscripción",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md space-y-3">
      <form
        className="flex overflow-hidden rounded-lg bg-white shadow-sm"
        onSubmit={handleSubmit}
      >
        <HoneypotField ref={honeypotRef} id="newsletter-hp-website" />
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Tu correo electrónico"
          required
          disabled={isSubmitting}
          aria-label="Correo electrónico para el newsletter"
          aria-describedby="newsletter-privacy-notice"
          className="h-10 flex-1 border-0 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex size-10 shrink-0 items-center justify-center text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: BRAND_BLUE }}
          aria-label="Suscribirse al newsletter"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </form>
      <FormDataProtectionNotice
        id="newsletter-privacy-notice"
        className="text-left text-slate-700"
        purpose="enviarte el newsletter y comunicaciones informativas sobre WiAuto"
      />
    </div>
  );
};
