import type { VehicleDetailView } from "../types/vehicle-detail.types";

const getMockVehicleDetail = (id: string): VehicleDetailView => ({
  id,
  title: "Toyota Corolla 2020 Full 1.8",
  condition_label: "Nuevo",
  published_at: "26/02 13:28",
  modified_at: "26/02 18:00",
  price: "$28,900",
  previous_price: "32,000 €",
  price_note: "+ Requisito",
  financing: "Financiamiento desde $482/mes - 60 meses",
  vat_note: "IVA incluido",
  images: [
    "/placeholder-car.jpg",
    "/placeholder-car.jpg",
    "/placeholder-car.jpg",
  ],
  services: [
    "Seguro A Todo Riesgo Sin Fronteras",
    "Aventura Y Reparaciones",
    "Sin Entrada",
  ],
  advertiser: {
    name: "gabriel@hotmail.com",
    email: "gabriel@hotmail.com",
    email_verified: false,
    phone: "+52 9878765663",
    profile_href: "#",
  },
  seller_comments: {
    description:
      "Seolco Motor, Concesionario Oficial Volkswagen en Alcorcón y Móstoles, le ofrece este espectacular VOLKSWAGEN Polo Life 1.0 TSI 95-cc completamente nuevo. La calidad y el prestigio de Volkswagen en Alcorcón y Móstoles. Nuestros comerciantes están encantados de ofrecerle y resaltar todos sus datos.",
    equipment_title: "Equipamiento de detección:",
    equipment_items: [
      "Fóra Volkswagen Full LED",
      "Volvómetro Digital Cadpist",
      "Conectividad App Connect",
      "Sistema de memoria antigua",
      "Sistema de almacenamiento de datos",
      "Control de velocidad de crucero",
      "Control de velocidad de frenado",
    ],
    footer_note:
      "Se escribe un mensaje de búsqueda en Volkswagen Polo Life, en Alcorcón y Móstoles, para que viva junto a nosotros la experiencia S-Estéticas!",
    legal_notes: [
      "El precio publicado corresponde a la versión pública. Unidad de entrega inmediata. Consulte otras opciones.",
      "El anuncio puede contener entre 1 y 3 imágenes de los modelos de un futuro contrato.",
    ],
    reference: "PoloMotors-Rent-0000",
  },
  price_analysis: {
    message:
      "El precio es sustancialmente inferior comparado con vehículos similares.",
    badge: "Si es Superprecio",
    disclaimer:
      "La valoración del precio de cada modelo es totalmente neutro y no puede ser inferior.",
  },
  specs: [
    { label: "Kilometraje", value: "0 Km" },
    { label: "Asientos", value: "4" },
    { label: "Puertas", value: "5" },
  ],
  reviews: [
    {
      id: "mock-review-1",
      author: "Luis Rodríguez",
      rating: 42,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: "mock-review-2",
      author: "Luis Rodríguez",
      rating: 42,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ],
  location: {
    area: "MORATALAZ",
    road: "A-3",
    address_lines: [
      "Cerro del Tío Pío • Centro Dep Municipal Margot",
      "Madrid Spain Temple • E-9 VALDEBERNARDO",
    ],
  },
  verified_seller: {
    name: "Motores Premium",
    subtitle: "AutoPlaza Lima",
    rating: "4.8",
    completed_sales: "243",
    response_time: "> 2 Horas",
    whatsapp_verified: true,
  },
  contact_phone: "+529878765663",
});

export const getVehicleDetail = async (id: string): Promise<VehicleDetailView> => {
  return getMockVehicleDetail(id);
};
