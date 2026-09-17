import { MapPin, Mail, Phone, type LucideIcon } from "lucide-react";

import { IconContainer } from "@/components/ui/iconContainer";

type InfoItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
};

const info: InfoItem[] = [
  {
    icon: MapPin,
    title: "Dirección",
    description: "Paseo Constitución 8, 50008 Zaragoza",
  },
  {
    icon: Mail,
    title: "Correo electrónico",
    description: "contacto@wiauto.es",
    href: "mailto:contacto@wiauto.es",
  },
  {
    icon: Phone,
    title: "Teléfono",
    description: "+34 666 11 27 58",
    href: "tel:+34666112758",
  },
];

export const ContactInfo = () => {
  return (
    <div className="mx-auto my-10 grid w-full max-w-4xl grid-cols-1 gap-4 px-4 sm:grid-cols-3">
      {info.map((item) => {
        const Content = (
          <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-6 text-center shadow-sm backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-card">
            <IconContainer Icon={item.icon} size="lg" rounded />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold">{item.title}</h4>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        );

        return (
          <div key={item.title}>
            {item.href ? (
              <a href={item.href} className="block h-full">
                {Content}
              </a>
            ) : (
              Content
            )}
          </div>
        );
      })}
    </div>
  );
};
