"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";

import { ControlledInput } from "@/components/forms/controlledInput";
import {
  PhoneInput,
  type PhoneFieldValue,
} from "@/components/forms/phoneInput";
import { SectionContainer } from "@/components/home";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconContainer } from "@/components/ui/iconContainer";
import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";
import { planContactLeadService } from "@/services/planContactLead/planContactLeadService";
import { phoneSchema } from "@/validations/phoneSchema";

import { plansIconPack } from "../utils/plansIconPack";

interface PlansContactSectionProps {
  data: StrapiCard;
}

const planContactFormSchema = z.object({
  phone: phoneSchema,
});

type PlanContactFormValues = z.infer<typeof planContactFormSchema>;

const defaultValues: PlanContactFormValues = {
  phone: {
    phone_code: "+34",
    phone: "",
  },
};

export const PlansContactSection = ({ data }: PlansContactSectionProps) => {
  const form = useForm<PlanContactFormValues>({
    resolver: zodResolver(planContactFormSchema),
    defaultValues,
  });

  const whatsappUrl = data.boton?.url;
  const whatsappLabel = data.boton?.label;
  const callbackLabel = data.boton_secundario?.label;
  const isCallbackSubmit = data.boton_secundario?.funcion !== false;

  const Icon =
    resolveStrapiIconName(
      data.iconName ?? data.boton?.iconName,
      plansIconPack,
    ) ?? FaWhatsapp;

  const bannerStyle = {
    ...(data.colorFondo ? { backgroundColor: data.colorFondo } : {}),
    ...(data.colorTexto ? { color: data.colorTexto } : {}),
  };

  const handleSubmit = async (values: PlanContactFormValues) => {
    try {
      const response = await planContactLeadService.create({
        phone: `${values.phone.phone_code} ${values.phone.phone}`.trim(),
        source: "planes",
      });

      if (!response.ok) {
        toast.error(
          response.message ||
            "No se pudo enviar la solicitud. Inténtalo de nuevo.",
        );
        return;
      }

      toast.success("Solicitud enviada. Te llamaremos pronto.");
      form.reset(defaultValues);
    } catch {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <SectionContainer>
      <div
        className={cn(
          "rounded-2xl  shadow-md bg-primary",
          "p-6 sm:p-8",
        )}
        style={bannerStyle}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-0 md:divide-x md:divide-white/20">
          <div className="flex  items-start gap-4 md:pr-8">
            <IconContainer
              Icon={Icon}
              rounded
              size="lg"
              className="bg-green-500 text-white"
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold tracking-tight  sm:text-2xl text-white">
                  {data.titulo}
                </h2>
              </div>

              {whatsappUrl ? (
                <Link href={whatsappUrl} target="_blank">
                  <Button
                    rel="noopener noreferrer"
                    className={cn(
                      "w-fit",
                      data.boton?.destacado !== false
                        ? "bg-[#25D366] text-white hover:bg-[#1ebe57]"
                        : "bg-black text-white hover:bg-black/90",
                    )}
                    aria-label={whatsappLabel ?? undefined}
                  >
                    <FaWhatsapp className="size-5" aria-hidden />
                    {whatsappLabel}
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 border-t border-white/20 pt-6 md:border-t-0 md:pt-0 md:pl-8">
            <h3 className="text-base font-semibold sm:text-lg text-white">
              {data.descripcion}
            </h3>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
              aria-label="Formulario para solicitar una llamada sobre planes"
            >
              <div className="min-w-0 flex-1 bg-white p-1.5 rounded-md">
                <ControlledInput
                  name="phone"
                  control={form.control}
                  label="Teléfono"
                  showLabel={false}
                  type="tel"
                  placeholder="Tu teléfono"
                  inputsClassName="bg-white text-black"
                >
                  {({ field }) => (
                    <PhoneInput
                      value={field.value as PhoneFieldValue}
                      onChange={field.onChange}
                      ariaInvalid={Boolean(form.formState.errors.phone)}
                    />
                  )}
                </ControlledInput>
              </div>

              {isCallbackSubmit && callbackLabel ? (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="shrink-0 bg-black text-white hover:bg-black/90"
                  aria-label={callbackLabel}
                >
                  {form.formState.isSubmitting ? "Enviando..." : callbackLabel}
                </Button>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
