export const PROFESSIONAL_EDIT_SECTIONS = [
  {
    id: "marca-modelo",
    title: "Marca y modelo",
    description: "Identifica el vehículo en el catálogo.",
  },
  {
    id: "datos-unidad",
    title: "Datos de la unidad",
    description: "Estado, kilometraje y ficha técnica.",
  },
  {
    id: "ubicacion",
    title: "Ubicación",
    description: "Indica dónde se encuentra el vehículo.",
  },
  {
    id: "vehiculo-exterior",
    title: "Vehículo y exterior",
    description: "Matrícula, bastidor y color.",
  },
  {
    id: "equipamiento",
    title: "Equipamiento",
    description: "Extras y servicios del anuncio.",
  },
  {
    id: "precio-garantia",
    title: "Precio y garantía",
    description: "Precio de venta, garantía y financiación.",
  },
  {
    id: "texto-comercial",
    title: "Texto comercial",
    description: "Descripción orientada a la venta.",
  },
  {
    id: "video",
    title: "Vídeo",
    description: "Vídeos opcionales del vehículo.",
  },
  {
    id: "fotografias",
    title: "Fotografías",
    description: "Añade al menos 3 fotos del vehículo.",
  },
  {
    id: "contacto",
    title: "Contacto",
    description: "Datos de contacto visibles en el anuncio.",
  },
] as const;

export type ProfessionalEditSectionId =
  (typeof PROFESSIONAL_EDIT_SECTIONS)[number]["id"];
