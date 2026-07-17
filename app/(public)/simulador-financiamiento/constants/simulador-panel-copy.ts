import type {
  SimuladorCopyUiView,
  SimuladorPageViewModel,
} from "../interfaces/simulador-page.interface";

/** Textos del panel de simulación (Nest) — no vienen de Strapi. */
export const SIMULADOR_PANEL_COPY: SimuladorCopyUiView = {
  tituloConfig: "1. Configura tu financiamiento",
  tituloResultados: "2. Resultados de tu simulación",
  botonCalcular: "Calcular financiamiento",
  textoConfianza: "Tus datos están seguros con nosotros",
  avisoReferencial:
    "Esta simulación es referencial. Las condiciones finales pueden variar según el banco, tu perfil crediticio y los seguros aplicables.",
  labelPrecio: "Precio del vehículo",
  labelEntrada: "Entrada inicial",
  labelPlazo: "Plazo del financiamiento",
  labelTasa: "Tasa de interés anual",
  labelSeguro: "Tipo de seguro (opcional)",
  badgeAprobacion: "¡Aprobación estimada!",
};

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
