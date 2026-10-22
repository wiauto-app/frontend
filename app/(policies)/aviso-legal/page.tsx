import type { Metadata } from "next";
import Link from "next/link";

import { LandingHeader } from "@/components/ui/landingHeader";
import { COMPANY_LEGAL } from "@/lib/legal/company-legal";

export const metadata: Metadata = {
  title: "Aviso legal | Wiauto",
  description:
    "Datos identificativos de WIAUTO MOTOR DIGITAL S.L. e información legal de la plataforma WiAuto.",
};

export default function AvisoLegalPage() {
  return (
    <>
      <LandingHeader title="Aviso legal" />
      <div className="bg-white px-4 py-12">
        <article className="prose prose-slate mx-auto max-w-3xl prose-p:text-muted-foreground prose-headings:text-foreground">
          <p className="text-sm text-muted-foreground">
            Última actualización: 21 de octubre de 2026
          </p>

          <h2>1. Titular del sitio web</h2>
          <p>
            En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de
            la sociedad de la información y de comercio electrónico (LSSI-CE), se
            informa que el titular de este sitio web y de la plataforma WiAuto
            es:
          </p>
          <ul>
            <li>
              <strong>Denominación social:</strong> {COMPANY_LEGAL.legalName}
            </li>
            <li>
              <strong>Forma jurídica:</strong> {COMPANY_LEGAL.legalForm}
            </li>
            <li>
              <strong>NIF:</strong> {COMPANY_LEGAL.nif}
            </li>
            <li>
              <strong>Domicilio social:</strong> {COMPANY_LEGAL.address}
            </li>
            <li>
              <strong>Correo electrónico:</strong>{" "}
              <a href={`mailto:${COMPANY_LEGAL.email}`}>{COMPANY_LEGAL.email}</a>
            </li>
            <li>
              <strong>Teléfono:</strong>{" "}
              <a href="tel:+34876212406">{COMPANY_LEGAL.phone}</a>
            </li>
            <li>
              <strong>Datos registrales:</strong> Inscrita en el{" "}
              {COMPANY_LEGAL.mercantileRegistry}, {COMPANY_LEGAL.mercantileRegistryEntry}.
            </li>
          </ul>

          <h2>2. Objeto</h2>
          <p>
            El presente aviso legal regula el acceso y la utilización del sitio
            web wiauto.es, la aplicación móvil y los servicios asociados. El
            acceso implica la aceptación de este aviso, de los{" "}
            <Link href="/terminos">términos y condiciones</Link> y de la{" "}
            <Link href="/privacidad">política de privacidad</Link>.
          </p>

          <h2>3. Propiedad intelectual e industrial</h2>
          <p>
            Los contenidos, diseños, código, marcas y signos distintivos de
            WiAuto son titularidad de {COMPANY_LEGAL.legalName} o de terceros
            licenciantes, y están protegidos por la normativa aplicable.
          </p>

          <h2>4. Responsabilidad</h2>
          <p>
            {COMPANY_LEGAL.legalName} no se hace responsable del uso indebido
            que los usuarios puedan hacer de los contenidos ni de los enlaces a
            sitios de terceros que puedan figurar en la plataforma.
          </p>

          <h2>5. Legislación aplicable</h2>
          <p>
            Este aviso legal se rige por la legislación española. Para
            condiciones de uso del servicio, consulta los{" "}
            <Link href="/terminos">términos y condiciones</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
