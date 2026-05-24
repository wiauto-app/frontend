import Image from "next/image";
import { SectionContainer } from "./SectionContainer";
import { BRAND_BLUE, VALUE_PROPOSITION_FEATURES } from "./data/home-data";

function FeatureIcon() {
  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white"
      style={{ backgroundColor: BRAND_BLUE }}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v4M10 10h4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function ValuePropositionSection() {
  return (
    <SectionContainer className="py-12 lg:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-[2rem] lg:leading-snug">
            <span style={{ color: BRAND_BLUE }}>WiAuto</span> llega para revolucionar la
            compra y venta de coches
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-500">
            Nuestra plataforma conecta a compradores y vendedores en un solo lugar,
            facilitando cada paso con tecnología, transparencia y herramientas diseñadas
            para encontrar el auto ideal o concretar una venta de forma eficiente.
          </p>

          <ul className="mt-8 space-y-5">
            {VALUE_PROPOSITION_FEATURES.map((feature) => (
              <li key={feature.id} className="flex items-center gap-4">
                <FeatureIcon />
                <span className="text-base text-slate-500">{feature.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex min-h-[320px] items-end justify-center lg:min-h-[400px]">
          <div
            className="absolute right-0 top-8 h-[85%] w-[88%] overflow-hidden rounded-tl-[4rem] rounded-br-2xl"
            style={{ backgroundColor: "#001F3F" }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23002855' width='400' height='200'/%3E%3Cpath fill='%23003d7a' d='M0 200V120l40-60 35 50 45-70 40 55 50-45 60 70 50-40 40 50V200z'/%3E%3Crect x='30' y='60' width='25' height='90' fill='%230052a3' opacity='.6'/%3E%3Crect x='70' y='40' width='30' height='110' fill='%230052a3' opacity='.7'/%3E%3Crect x='120' y='50' width='22' height='100' fill='%230052a3' opacity='.5'/%3E%3Crect x='160' y='30' width='35' height='120' fill='%230052a3' opacity='.8'/%3E%3Crect x='210' y='55' width='28' height='95' fill='%230052a3' opacity='.6'/%3E%3Crect x='260' y='45' width='32' height='105' fill='%230052a3' opacity='.7'/%3E%3Crect x='310' y='65' width='25' height='85' fill='%230052a3' opacity='.5'/%3E%3C/svg%3E")`,
                backgroundSize: "cover",
                backgroundPosition: "bottom",
              }}
              aria-hidden
            />
          </div>

          <div className="relative z-10 w-full max-w-md -translate-x-4 lg:-translate-x-8">
            <Image
              src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&auto=format&fit=crop"
              alt="Vehículo destacado"
              width={640}
              height={400}
              className="h-auto w-full object-contain drop-shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
