import type { SimuladorPageViewModel } from "../interfaces/simulador-page.interface";

/** CTA final local (ancla al panel) — no viene de Strapi. */
export const SIMULADOR_CTA: SimuladorPageViewModel["ctaFinal"] = {
  titulo: "¿Listo para estrenar tu próximo vehículo?",
  botonTexto: "Comenzar simulación",
  botonUrl: "#simulador",
};

export const SIMULADOR_SEO_DEFAULTS = {
  title: "Simulador de Financiamiento | WiAuto",
  description:
    "Calcula tu cuota mensual, compara opciones y elige el financiamiento que mejor se adapte a ti.",
} as const;
