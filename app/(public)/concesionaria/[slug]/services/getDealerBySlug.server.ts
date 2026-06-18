import { API_URL } from "@/constants";
import type { DealerProfile } from "../interfaces";

const MOCK_DEALER: DealerProfile = {
  id: "1",
  slug: "motores-premium-1",
  name: "Motores Premium",
  tagline: "Calidad, confianza y los mejores vehículos para tu negocio.",
  type: "oficial",
  isVerified: true,
  rating: 4.8,
  reviewCount: 120,
  memberSince: "Ene 2021",
  lastConnection: "Hoy",
  avatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
  banner:
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80",
  about:
    "Somos un concesionario oficial con más de 15 años de experiencia en el sector automovilístico. Nos especializamos en vehículos de alta gama y ofrecemos un servicio integral de compra, financiación y posventa.",
  highlights: [
    "Vehículos revisados y certificados",
    "Precios competitivos",
    "Atención personalizada",
  ],
  contact: {
    phone: "+34 678 123 456",
    email: "ventas@motorespremium.com",
    location: "Madrid, España",
    schedule: "Lun - Vie: 9:00 - 18:00",
  },
  stats: {
    score: 4.8,
    completedSales: 243,
    responseTime: "< 2 h",
  },
  quickStats: {
    publishedVehicles: 45,
    positiveReviewsPercent: 98,
    transactions: 120,
    yearsOnPlatform: 3,
  },
  vehicles: [
    {
      id: "v1",
      make: "Chevrolet",
      model: "Trailblazer",
      price: 19000,
      condition: "new",
      imageCount: 18,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
      tags: ["Reservable", "Profesional"],
    },
    {
      id: "v2",
      make: "Chevrolet",
      model: "Trailblazer",
      price: 19000,
      condition: "new",
      imageCount: 18,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
      tags: ["Reservable", "Profesional"],
    },
    {
      id: "v3",
      make: "Chevrolet",
      model: "Trailblazer",
      price: 19000,
      condition: "new",
      imageCount: 18,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80",
      tags: ["Reservable", "Profesional"],
    },
    {
      id: "v4",
      make: "Chevrolet",
      model: "Trailblazer",
      price: 19000,
      condition: "new",
      imageCount: 18,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      tags: ["Reservable", "Profesional"],
    },
  ],
  reviews: [
    {
      id: "r1",
      author: "Carlos M.",
      rating: 5,
      comment:
        "Excelente atención y vehículos en perfectas condiciones. Proceso de compra rápido y transparente. 100% recomendado para concesionarios.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: "r2",
      author: "Laura G.",
      rating: 5,
      comment:
        "Muy profesionales y siempre dispuestos a ayudar. Los vehículos coinciden exactamente con la descripción.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    },
    {
      id: "r3",
      author: "Javier P.",
      rating: 5,
      comment:
        "Gran variedad de stock y precios competitivos. Volvería a comprar seguro.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    },
  ],
  ratingDistribution: [
    { stars: 5, count: 85 },
    { stars: 4, count: 25 },
    { stars: 3, count: 7 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ],
};

const buildMockFromSlug = (slug: string): DealerProfile => {
  const baseName = slug
    .replace(/-\d+$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    ...MOCK_DEALER,
    id: slug,
    slug,
    name: baseName || MOCK_DEALER.name,
  };
};

export const getDealerBySlug = async (
  slug: string,
): Promise<DealerProfile | null> => {
  try {
    if (API_URL) {
      const response = await fetch(`${API_URL}/v1/dealers/${slug}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const body = await response.json();
        if (body.data) {
          return body.data as DealerProfile;
        }
      }
    }
  } catch {
    // Fall through to mock data
  }
  try {
    if (API_URL) {
      const response = await fetch(`${API_URL}/v1/dealers/${slug}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const body = await response.json();
        if (body.data) {
          return body.data as DealerProfile;
        }
      }
    }
  } catch {
    // Fall through to mock data
  }

  return buildMockFromSlug(slug);
};
