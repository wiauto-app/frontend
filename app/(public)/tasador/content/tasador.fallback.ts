import { withStrapiFallback, type StrapiFallback } from "@/lib/strapi-content";

import type { StrapiPaginaTasadorResponse } from "../types/strapi-tasador.types";

const check = (label: string) => ({ label, iconName: "HiCheckCircle" });

/** Textos de respaldo de `pagina-tasador`, por si Strapi no responde o deja campos vacíos. */
export const TASADOR_FALLBACK: StrapiFallback<StrapiPaginaTasadorResponse> = {
  seo: {
    metaTitle: "Tasador de coches gratis con IA | WiAuto",
    metaDescription:
      "Tasa tu coche gratis en segundos con inteligencia artificial y precios reales del mercado español. Publica tu anuncio o recibe ofertas de concesionarios verificados.",
  },
  hero: {
    titulo: "Vende tu coche a profesionales",
    descripcion:
      "Recibe ofertas de concesionarios verificados de forma rápida, segura y sin compromiso.",
    caracteristicas: [
      { label: "Publicación privada", iconName: "HiOutlineEyeOff" },
      { label: "Solo concesionarios verificados", iconName: "HiOutlineUsers" },
      { label: "Recibe varias ofertas", iconName: "HiOutlineCurrencyEuro" },
      { label: "Elige la mejor oferta", iconName: "HiOutlineShieldCheck" },
    ],
  },
  formulario: {
    encabezado_vehiculo: {
      titulo: "¿Qué vehículo vendes?",
      descripcion:
        "Introduce la información de tu coche para obtener una tasación y recibir ofertas.",
    },
    marca: { label: "Marca", placeholder: "Marca", mensaje_requerido: "Selecciona la marca" },
    modelo: { label: "Modelo", placeholder: "Modelo", mensaje_requerido: "Selecciona el modelo" },
    anio: { label: "Año", placeholder: "Año", mensaje_requerido: "Selecciona el año" },
    version: { label: "Versión", placeholder: "Versión", mensaje_requerido: "Selecciona la versión" },
    transmision: {
      label: "Tipo de transmisión",
      placeholder: "Transmisión",
      mensaje_requerido: "Selecciona la transmisión",
    },
    kilometraje: {
      label: "Kilometraje",
      placeholder: "0",
      mensaje_requerido: "Introduce el kilometraje",
      mensaje_invalido: "Introduce un kilometraje válido",
    },
    combustible: { label: "Combustible", placeholder: "Se completa con la versión" },
    potencia: {
      label: "Potencia (CV)",
      placeholder: "CV",
      mensaje_invalido: "Introduce una potencia válida",
    },
    matricula: {
      label: "Matrícula (opcional)",
      placeholder: "Ej: 1234ABC",
      ayuda:
        "No se mostrará públicamente. Ayuda a los concesionarios a identificar tu coche.",
      mensaje_invalido: "Introduce una matrícula válida",
    },
    encabezado_contacto: {
      titulo: "Tus datos de contacto",
      descripcion: "Solo los compartiremos con el concesionario cuya oferta aceptes.",
    },
    nombre: {
      label: "Nombre",
      placeholder: "Nombre",
      mensaje_invalido: "El nombre debe tener al menos 2 caracteres",
    },
    apellidos: { label: "Apellidos", placeholder: "Apellidos" },
    email: { label: "Email", placeholder: "Email", mensaje_invalido: "Email inválido" },
    telefono: {
      label: "Teléfono",
      label_numero: "Número de teléfono",
      placeholder_numero: "Número de móvil",
    },
    boton: { label: "Tasar coche", label_cargando: "Tasando tu coche..." },
    mensajes: {
      exito: "¡Tasación lista!",
      error_generico:
        "No pudimos tasar tu coche ahora mismo. Inténtalo de nuevo en unos minutos.",
    },
  },
  aviso_privacidad: {
    titulo: "Tu anuncio no será público",
    descripcion: "Tu coche solo lo verán concesionarios verificados de WiAuto.",
    iconName: "HiOutlineLockClosed",
  },
  como_funciona: {
    header: { titulo: "¿Cómo funciona?" },
    caracteristicas: [
      {
        label: "Introduce los datos de tu vehículo",
        descripcion: "Completa la información en menos de un minuto.",
        iconName: "HiOutlineDocumentText",
      },
      {
        label: "Obtén una tasación orientativa",
        descripcion: "Nuestra IA analiza el mercado español.",
        iconName: "HiOutlineChartBar",
      },
      {
        label: "Recibe ofertas de concesionarios",
        descripcion: "Solo profesionales verificados verán tu coche.",
        iconName: "HiOutlineUsers",
      },
      {
        label: "Elige la mejor oferta",
        descripcion: "Sin compromiso. Tú decides.",
        iconName: "HiOutlineCurrencyEuro",
      },
    ],
  },
  resultado: {
    encabezado: { titulo: "Valor estimado de tu vehículo" },
    label_precio_bajo: "Precio bajo",
    label_precio_mercado: "Precio de mercado",
    label_precio_alto: "Precio alto",
    titulo_explicacion: "Recomendación IA",
    label_confianza: "Confianza",
    confianza_alta: "Alta",
    confianza_media: "Media",
    confianza_baja: "Baja",
    aviso_ia: {
      texto:
        "Esta tasación es orientativa y se basa en precios reales del mercado español, kilometraje y datos del vehículo. Las ofertas de los concesionarios pueden variar tras revisar el coche.",
      tipo: "exito",
    },
    boton_modificar: "Modificar datos",
  },
  opciones: {
    encabezado: {
      titulo: "¿Qué quieres hacer con tu coche?",
      descripcion:
        "Elige la opción que mejor se adapte a ti. Puedes cambiar de opción más adelante.",
    },
    publicar: {
      badge: "Recomendado",
      titulo: "Publicar mi coche",
      descripcion:
        "Crea tu anuncio en WiAuto y véndelo directamente a particulares y profesionales.",
      iconName: "HiOutlineSpeakerphone",
      puntos: [
        check("Tu coche será visible en WiAuto"),
        check("Recibe contactos de compradores interesados"),
        check("Tú decides con quién negociar"),
        check("Sin compromiso"),
      ],
      boton: { label: "Publicar ahora", url: "/publicar" },
    },
    recibir_ofertas: {
      titulo: "Recibir ofertas de concesionarios",
      descripcion:
        "Envía los datos de tu vehículo a concesionarios verificados de WiAuto y recibe ofertas de compra.",
      iconName: "FaHandshake",
      puntos: [
        check("Tu coche no será público"),
        check("Solo lo verán concesionarios verificados"),
        check("Recibe varias ofertas en poco tiempo"),
        check("Tú decides la mejor oferta"),
        check("Sin compromiso y de forma segura"),
      ],
      boton: { label: "Quiero recibir ofertas", url: "#recibir-ofertas", funcion: true },
    },
  },
  ofertas: {
    encabezado_enviado: {
      titulo: "¡Solicitud enviada!",
      descripcion:
        "Hemos avisado a los concesionarios verificados. Te notificaremos en cuanto recibas una oferta.",
    },
    enlace_ver_ofertas: { label: "Ver mis tasaciones", url: "/usuario/mi-tasador" },
    encabezado_ofertas: {
      titulo: "Ofertas recibidas",
      descripcion: "Compara las ofertas y acepta la que más te convenga.",
    },
    sin_ofertas:
      "Todavía no has recibido ofertas. Te avisaremos en cuanto un concesionario oferte.",
    boton_aceptar: "Aceptar oferta",
    boton_rechazar: "Rechazar",
    confirmar_aceptar:
      "Al aceptar, compartiremos tus datos de contacto con este concesionario y el resto de ofertas se cerrarán.",
    mensajes: {
      exito: "Hemos enviado tu solicitud a los concesionarios.",
      error_generico: "No pudimos enviar la solicitud. Inténtalo de nuevo.",
    },
  },
  confianza: [
    {
      label: "Rápido y sencillo",
      descripcion: "Completa el proceso en pocos minutos.",
      iconName: "HiOutlineLightningBolt",
    },
    {
      label: "Concesionarios verificados",
      descripcion: "Solo profesionales de confianza.",
      iconName: "HiOutlineShieldCheck",
    },
    {
      label: "Tus datos siempre protegidos",
      descripcion: "Información segura y confidencial.",
      iconName: "HiOutlineLockClosed",
    },
    {
      label: "Tú decides",
      descripcion: "Sin compromiso. Elige la opción que más te convenga.",
      iconName: "HiOutlineUser",
    },
  ],
};

/** Respaldo completo, para componentes que se usan fuera de /tasador (p. ej. el panel). */
export const TASADOR_DEFAULT = withStrapiFallback<StrapiPaginaTasadorResponse>(
  null,
  TASADOR_FALLBACK,
);
