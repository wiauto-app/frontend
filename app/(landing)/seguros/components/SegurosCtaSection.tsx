import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BRAND_BLUE, CONFIDENZA_WEBSITE } from "../constants";

export function SegurosCtaSection() {
  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: BRAND_BLUE }}
    >
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="py-10 sm:py-12 text-white px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Cotiza y contrata tu seguro directamente con Seguros Confianza
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Hazlo fácil, hazlo online, hazlo seguro.
            </p>
            <Button
              size="lg"
              className="mt-8 rounded-xl bg-white px-8 font-bold hover:bg-blue-50"
              style={{ color: BRAND_BLUE }}
              asChild
            >
              <Link href={CONFIDENZA_WEBSITE}>Conoce más en su sitio web</Link>
            </Button>
          </div>
          <div className="relative h-64 md:h-full">
            <Image
              src="https://images.unsplash.com/photo-1606016159991-dfe4f2746ad9?auto=format&fit=crop&q=80&w=800"
              alt="White SUV car"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
